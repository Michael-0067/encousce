import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { openai } from "@/lib/openai";
import { getUserBalance } from "@/lib/wallet";
import { SETTING_LABELS, SCENE_GENERATION_COST } from "@/lib/constants";

// ── Prompt builders ────────────────────────────────────────────────────────

function buildImagePrompt(b: SceneBody): string {
  const setting = SETTING_LABELS[b.setting] ?? b.setting;
  const detail = b.environmentDetails ? `${b.environmentDetails}.` : "";

  return [
    `${setting} ${b.subLocation}.`,
    `${b.timeOfDay}.`,
    `${b.lighting} lighting.`,
    `${b.atmosphere} atmosphere.`,
    detail,
    "No people, no text.",
    "Cinematic, editorial, immersive. Moody and romantic.",
    "High quality interior or exterior photograph.",
  ].filter(Boolean).join(" ");
}

function buildScenePrompt(b: SceneBody): string {
  return `Scene: ${b.title}
Setting: ${SETTING_LABELS[b.setting] ?? b.setting} — ${b.subLocation}
Time: ${b.timeOfDay} | Lighting: ${b.lighting} | Atmosphere: ${b.atmosphere}

Situation: ${b.coreSituation}

Relationship: ${b.relationshipDynamic}
The lead's intent: ${b.leadIntent}

Opening: ${b.openingMoment}

Emotional Tone: ${b.emotionalTone}
Underlying tension: ${b.emotionalHook}
Encounter Goal: ${b.encounterGoal}`;
}

// ── Types ──────────────────────────────────────────────────────────────────

interface SceneBody {
  title: string;
  setting: string;
  subLocation: string;
  timeOfDay: string;
  lighting: string;
  atmosphere: string;
  environmentDetails: string;
  coreSituation: string;
  relationshipDynamic: string;
  leadIntent: string;
  openingMoment: string;
  emotionalTone: string;
  emotionalHook: string;
  encounterGoal: string;
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body: SceneBody = await req.json();

  const missing = [
    !body.title?.trim() && "title",
    !body.setting && "setting",
    !body.subLocation && "subLocation",
    !body.timeOfDay && "timeOfDay",
    !body.lighting && "lighting",
    !body.atmosphere && "atmosphere",
    !body.coreSituation?.trim() && "coreSituation",
    !body.relationshipDynamic && "relationshipDynamic",
    !body.leadIntent && "leadIntent",
    !body.openingMoment?.trim() && "openingMoment",
    !body.emotionalTone && "emotionalTone",
    !body.emotionalHook?.trim() && "emotionalHook",
    !body.encounterGoal && "encounterGoal",
  ].filter(Boolean);

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const isAdmin = session.user.role === "ADMIN";

  const preciseBalance = await getUserBalance(session.user.id);
  const cost = new Prisma.Decimal(SCENE_GENERATION_COST);

  if (!isAdmin && preciseBalance.lessThan(cost)) {
    return NextResponse.json(
      { error: "INSUFFICIENT_HEARTS", balance: preciseBalance.floor().toNumber() },
      { status: 402 }
    );
  }

  const imagePrompt = buildImagePrompt(body);
  const generatedPrompt = buildScenePrompt(body);

  // Generate cover image (environment only, no people)
  let coverImage: string | null = null;
  try {
    const imageResult = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1792x1024",
      quality: "standard",
      n: 1,
    });

    const tempUrl = imageResult.data?.[0]?.url;
    if (tempUrl) {
      const imgRes = await fetch(tempUrl);
      const buffer = await imgRes.arrayBuffer();
      coverImage = `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
    }
  } catch (err) {
    console.error("[create/scene] image generation failed:", err);
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
            "You write single-sentence teasers for scene cards on a romantic encounter platform. Be evocative and immediate. Suggest emotional tension without explaining it. No clichés. Just the line.",
        },
        {
          role: "user",
          content: `Title: ${body.title}\nAtmosphere: ${body.atmosphere}\nEmotional Hook: ${body.emotionalHook}\nTone: ${body.emotionalTone}`,
        },
      ],
      max_tokens: 80,
      temperature: 0.85,
    });
    teaserText = gpt.choices[0]?.message?.content?.trim() ?? "";
  } catch (err) {
    console.error("[create/scene] teaser generation failed:", err);
  }

  const tier = isAdmin ? "SYSTEM" : "COMMUNITY";
  const newBalance = preciseBalance.sub(cost);

  try {
    const scene = await db.$transaction(async (tx) => {
      if (!isAdmin) {
        await tx.ledgerEntry.create({
          data: {
            userId: session.user.id,
            type: "SCENE_GENERATION",
            amount: cost.negated(),
            balanceAfter: newBalance,
            note: `Created: ${body.title}`,
          },
        });
      }

      return tx.scene.create({
        data: {
          authorId: session.user.id,
          title: body.title.trim(),
          setting: body.setting,
          subLocation: body.subLocation,
          timeOfDay: body.timeOfDay,
          lighting: body.lighting,
          atmosphere: body.atmosphere,
          environmentDetails: body.environmentDetails?.trim() || null,
          coreSituation: body.coreSituation.trim(),
          relationshipDynamic: body.relationshipDynamic,
          leadIntent: body.leadIntent,
          openingMoment: body.openingMoment.trim(),
          emotionalTone: body.emotionalTone,
          emotionalHook: body.emotionalHook.trim(),
          encounterGoal: body.encounterGoal,
          generatedPrompt,
          imagePrompt,
          teaserText,
          coverImage,
          tier,
          status: "DRAFT",
        },
      });
    });

    return NextResponse.json({
      scene: {
        id: scene.id,
        title: scene.title,
        coverImage: scene.coverImage,
        setting: scene.setting,
        subLocation: scene.subLocation,
        teaserText: scene.teaserText,
        status: scene.status,
      },
    });
  } catch (err) {
    console.error("[create/scene] save failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
