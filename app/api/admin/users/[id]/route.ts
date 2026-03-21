import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";

const VALID_ROLES = ["USER", "ADMIN"];
const VALID_STATUSES = ["ACTIVE", "SUSPENDED", "DISABLED"];

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  // Prevent self-demotion
  if (id === session.user.id && body.role && body.role !== "ADMIN") {
    return NextResponse.json({ error: "Cannot remove own admin role" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (body.role && VALID_ROLES.includes(body.role)) data.role = body.role;
  if (body.status && VALID_STATUSES.includes(body.status)) data.status = body.status;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const user = await db.user.update({ where: { id }, data, select: { id: true, role: true, status: true } });
  return NextResponse.json(user);
}
