import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { characterId } = await params;
  const userId = session.user.id;

  const existing = await db.favoriteCharacter.findUnique({
    where: { userId_characterId: { userId, characterId } },
  });

  if (existing) {
    await db.favoriteCharacter.delete({ where: { userId_characterId: { userId, characterId } } });
    return NextResponse.json({ favorited: false });
  } else {
    await db.favoriteCharacter.create({ data: { userId, characterId } });
    return NextResponse.json({ favorited: true });
  }
}
