import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!["DRAFT", "PUBLISHED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const scene = await db.scene.findUnique({ where: { id } });
  if (!scene || scene.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await db.scene.update({ where: { id }, data: { status } });
  return NextResponse.json({ scene: updated });
}
