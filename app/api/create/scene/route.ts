import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const {
      title, coverImage, setting, coreSituation, emotionalHook,
      openingMoment, toneTags, allowedType1, allowedType2, status,
    } = body;

    if (!title || !setting || !coreSituation || !emotionalHook || !openingMoment || !allowedType1) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const tier = session.user.role === "ADMIN" ? "SYSTEM" : "COMMUNITY";

    const scene = await db.scene.create({
      data: {
        title,
        coverImage: coverImage || null,
        setting,
        coreSituation,
        emotionalHook,
        openingMoment,
        toneTags: JSON.stringify(
          Array.isArray(toneTags)
            ? toneTags
            : (toneTags || "").split(",").map((t: string) => t.trim()).filter(Boolean)
        ),
        allowedType1,
        allowedType2: allowedType2 || null,
        status: status || "DRAFT",
        tier,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ scene });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
