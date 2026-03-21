import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { openai } from "@/lib/openai";
import { getUserBalance } from "@/lib/wallet";
import { LEAD_TYPE_LABELS, CHARACTER_GENERATION_COST } from "@/lib/constants";

// ── Prompt builders ────────────────────────────────────────────────────────

function buildImagePrompt(b: CharacterBody): string {
  const sex = b.visualSex !== "Unspecified" ? b.visualSex.toLowerCase() : "person";
  const expression = b.genderExpression !== "Unspecified"
    ? `${b.genderExpression.toLowerCase()}-presenting`
    : "";
  const ethnicity = b.raceEthnicity && b.raceEthnicity !== "Unspecified"
    ? `${b.raceEthnicity}.`
    : "";
  const feature = b.distinguishingFeature ? `${b.distinguishingFeature}.` : "";
  const archetype = LEAD_TYPE_LABELS[b.primaryType] ?? b.primaryType;

  return [
    `Cinematic portrait of a ${b.apparentAge} ${b.build.toLowerCase()} ${expression} ${sex}.`,
    ethnicity,
    `${b.hairStyle.toLowerCase()} ${b.hairColor.toLowerCase()} hair, ${b.eyeColor.toLowerCase()} eyes.`,
    feature,
    `Overall presence: ${b.presence.toLowerCase()}.`,
    `Archetype energy: ${archetype}.`,
    "Single subject, romantic lead. Tasteful, editorial, emotionally suggestive.",
    "Cinematic lighting and composition. No text, no other people. High quality.",
  ].filter(Boolean).join(" ");
}

function buildCharacterPrompt(b: CharacterBody): string {
  const archetype = LEAD_TYPE_LABELS[b.primaryType] ?? b.primaryType;
  const secondary = b.secondaryTrait ? `, with ${b.secondaryTrait.toLowerCase()} quality` : "";
  const always = b.alwaysBehaviors.map((r) => `- ${r}`).join("\n");
  const never = b.neverBehaviors.map((r) => `- ${r}`).join("\n");

  return `You are ${b.name}.

Archetype: ${archetype}${secondary}
Presence: ${b.presence} | Build: ${b.build} | Age: ${b.apparentAge}

Core Personality: ${b.corePersonality}

Interaction: ${b.interactionStyle}
Dialogue: ${b.dialogueTone}
Emotional Entry: ${b.emotionalStartingState}

Always:
${always}

Never:
${never}

Directives: You are romantically interested in the user. Direct your attraction toward them. Do not assume user identity unless they share it. Default to neutral language. Adapt naturally as the user reveals details. Keep tone romantic but not explicit. Prioritize short, interactive responses over narration or monologue.`;
}

// ── Types ──────────────────────────────────────────────────────────────────

interface CharacterBody {
  name: string;
  setting: string;
  visualSex: string;
  genderExpression: string;
  raceEthnicity: string;
  apparentAge: string;
  build: string;
  presence: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  distinguishingFeature: string;
  primaryType: string;
  secondaryTrait: string;
  corePersonality: string;
  interactionStyle: string;
  dialogueTone: string;
  emotionalStartingState: string;
  alwaysBehaviors: string[];
  neverBehaviors: string[];
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body: CharacterBody = await req.json();

  // Validate required fields
  const missing = [
    !body.name?.trim() && "name",
    !body.setting && "setting",
    !body.primaryType && "primaryType",
    !body.corePersonality?.trim() && "corePersonality",
    !body.interactionStyle && "interactionStyle",
    !body.dialogueTone && "dialogueTone",
    !body.emotionalStartingState && "emotionalStartingState",
    (!body.alwaysBehaviors?.length || body.alwaysBehaviors.length < 2) && "alwaysBehaviors",
    (!body.neverBehaviors?.length || body.neverBehaviors.length < 2) && "neverBehaviors",
  ].filter(Boolean);

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const isAdmin = session.user.role === "ADMIN";

  // Heart balance check
  const preciseBalance = await getUserBalance(session.user.id);
  const cost = new Prisma.Decimal(CHARACTER_GENERATION_COST);

  if (!isAdmin && preciseBalance.lessThan(cost)) {
    return NextResponse.json(
      { error: "INSUFFICIENT_HEARTS", balance: preciseBalance.floor().toNumber() },
      { status: 402 }
    );
  }

  // Build prompts
  const imagePrompt = buildImagePrompt(body);
  const generatedPrompt = buildCharacterPrompt(body);

  // Generate portrait image
  let portraitImage: string | null = null;
  try {
    const imageResult = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const tempUrl = imageResult.data?.[0]?.url;
    if (tempUrl) {
      // Download and store as base64 to avoid URL expiry
      const imgRes = await fetch(tempUrl);
      const buffer = await imgRes.arrayBuffer();
      portraitImage = `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
    }
  } catch (err) {
    console.error("[create/character] image generation failed:", err);
    // Continue without image rather than failing the whole request
  }

  // Generate teaser text
  let teaserText = "";
  try {
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write single-sentence teaser lines for character cards on a romantic encounter platform. Be evocative and brief. Suggest emotional depth without over-explaining. No clichés. No greeting or introduction. Just the line.",
        },
        {
          role: "user",
          content: `Name: ${body.name}\nArchetype: ${LEAD_TYPE_LABELS[body.primaryType] ?? body.primaryType}\nPersonality: ${body.corePersonality}\nEmotional State: ${body.emotionalStartingState}`,
        },
      ],
      max_tokens: 80,
      temperature: 0.85,
    });
    teaserText = gpt.choices[0]?.message?.content?.trim() ?? "";
  } catch (err) {
    console.error("[create/character] teaser generation failed:", err);
  }

  // Deduct hearts and save character atomically
  const tier = isAdmin ? "SYSTEM" : "COMMUNITY";
  const newBalance = preciseBalance.sub(cost);

  try {
    const character = await db.$transaction(async (tx) => {
      if (!isAdmin) {
        await tx.ledgerEntry.create({
          data: {
            userId: session.user.id,
            type: "CHARACTER_GENERATION",
            amount: cost.negated(),
            balanceAfter: newBalance,
            note: `Created: ${body.name}`,
          },
        });
      }

      return tx.character.create({
        data: {
          authorId: session.user.id,
          name: body.name.trim(),
          setting: body.setting,
          visualSex: body.visualSex,
          genderExpression: body.genderExpression,
          raceEthnicity: body.raceEthnicity || null,
          apparentAge: body.apparentAge,
          build: body.build,
          presence: body.presence,
          hairStyle: body.hairStyle,
          hairColor: body.hairColor,
          eyeColor: body.eyeColor,
          distinguishingFeature: body.distinguishingFeature?.trim() || null,
          primaryType: body.primaryType,
          secondaryTrait: body.secondaryTrait || null,
          corePersonality: body.corePersonality.trim(),
          interactionStyle: body.interactionStyle,
          dialogueTone: body.dialogueTone,
          emotionalStartingState: body.emotionalStartingState,
          alwaysBehaviors: JSON.stringify(body.alwaysBehaviors),
          neverBehaviors: JSON.stringify(body.neverBehaviors),
          generatedPrompt,
          imagePrompt,
          teaserText,
          portraitImage,
          tier,
          status: "DRAFT",
        },
      });
    });

    return NextResponse.json({
      character: {
        id: character.id,
        name: character.name,
        portraitImage: character.portraitImage,
        primaryType: character.primaryType,
        secondaryTrait: character.secondaryTrait,
        teaserText: character.teaserText,
        status: character.status,
      },
    });
  } catch (err) {
    console.error("[create/character] save failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
