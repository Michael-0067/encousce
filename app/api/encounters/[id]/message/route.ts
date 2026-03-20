import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getUserBalance } from "@/lib/wallet";
import { openai, buildSystemPrompt } from "@/lib/openai";
import { CHARS_PER_HEART } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id: encounterId } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  // Verify encounter ownership
  const encounter = await db.encounter.findUnique({
    where: { id: encounterId },
    include: {
      scene: true,
      character: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!encounter || encounter.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const isAdmin = session.user.role === "ADMIN";

  // Character-based cost: characters / CHARS_PER_HEART
  const charCount = content.trim().length;
  const cost = new Prisma.Decimal(charCount).div(new Prisma.Decimal(CHARS_PER_HEART));

  // Precise Decimal balance — source of truth
  const preciseBalance = await getUserBalance(session.user.id);

  // Spend check against precise balance (not spendable floor)
  if (!isAdmin && preciseBalance.lessThan(cost)) {
    return NextResponse.json(
      { error: "INSUFFICIENT_HEARTS", balance: preciseBalance.floor().toNumber() },
      { status: 402 }
    );
  }

  // Store user message
  const userMessage = await db.message.create({
    data: {
      encounterId,
      role: "USER",
      content: content.trim(),
      heartCost: isAdmin ? 0 : cost.toNumber(),
    },
  });

  // Build conversation history for OpenAI
  const systemPrompt = buildSystemPrompt(encounter.scene, encounter.character);
  const history = [...encounter.messages, userMessage].map((m) => ({
    role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  // Call OpenAI
  let aiContent = "";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...history],
      max_tokens: 300,
      temperature: 0.85,
    });
    aiContent = completion.choices[0]?.message?.content?.trim() || "…";
  } catch {
    await db.message.delete({ where: { id: userMessage.id } });
    return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 503 });
  }

  // Store AI response (no charge)
  const aiMessage = await db.message.create({
    data: { encounterId, role: "ASSISTANT", content: aiContent, heartCost: 0 },
  });

  // Deduct from ledger using Decimal arithmetic
  let newSpendable = preciseBalance.floor().toNumber();
  if (!isAdmin) {
    const newPrecise = preciseBalance.sub(cost);
    newSpendable = newPrecise.floor().toNumber();

    // Temporary spend logging for validation
    console.log(
      `[spend] chars=${charCount} cost=${cost.toFixed(6)} ` +
      `prev=${preciseBalance.toFixed(6)} new=${newPrecise.toFixed(6)}`
    );

    await db.ledgerEntry.create({
      data: {
        userId: session.user.id,
        type: "MESSAGE_SPEND",
        amount: cost.negated(),
        balanceAfter: newPrecise,
        referenceId: encounterId,
        note: `${charCount} chars`,
      },
    });
  }

  // Update encounter lastAccessedAt
  await db.encounter.update({
    where: { id: encounterId },
    data: { lastAccessedAt: new Date() },
  });

  // Track engagement
  await db.engagementEvent.create({
    data: {
      userId: session.user.id,
      eventType: "message_sent",
      encounterId,
      sceneId: encounter.sceneId,
      characterId: encounter.characterId,
    },
  }).catch(() => {});

  return NextResponse.json({
    userMessage,
    aiMessage,
    balance: newSpendable,
  });
}
