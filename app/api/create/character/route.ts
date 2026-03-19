import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, portraitImage, primaryType, secondaryType,
      compatibleSettings, corePersonality, interactionStyle,
      dialogueTone, behaviorRules, status,
    } = body;

    if (!name || !primaryType || !corePersonality || !interactionStyle || !dialogueTone || !behaviorRules) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const tier = session.user.role === "ADMIN" ? "SYSTEM" : "COMMUNITY";

    const character = await db.character.create({
      data: {
        name,
        portraitImage: portraitImage || null,
        primaryType,
        secondaryType: secondaryType || null,
        compatibleSettings: JSON.stringify(
          Array.isArray(compatibleSettings) ? compatibleSettings : []
        ),
        corePersonality,
        interactionStyle,
        dialogueTone,
        behaviorRules,
        status: status || "DRAFT",
        tier,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ character });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
