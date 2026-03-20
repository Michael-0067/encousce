import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getUserBalance } from "@/lib/wallet";
import { openai, buildSystemPrompt } from "@/lib/openai";
import { HEARTS_PER_MESSAGE } from "@/lib/constants";

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

  // Admin bypass — check role
  const isAdmin = session.user.role === "ADMIN";

  // Check hearts balance
  const balance = await getUserBalance(session.user.id);
  if (!isAdmin && balance < HEARTS_PER_MESSAGE) {
    return NextResponse.json(
      { error: "INSUFFICIENT_HEARTS", balance },
      { status: 402 }
    );
  }

  // Store user message
  const userMessage = await db.message.create({
    data: {
      encounterId,
      role: "USER",
      content: content.trim(),
      heartCost: isAdmin ? 0 : HEARTS_PER_MESSAGE,
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
    // If OpenAI fails, roll back user message
    await db.message.delete({ where: { id: userMessage.id } });
    return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 503 });
  }

  // Store AI response
  const aiMessage = await db.message.create({
    data: { encounterId, role: "ASSISTANT", content: aiContent, heartCost: 0 },
  });

  // Deduct hearts (skip for admin)
  let newBalance = balance;
  if (!isAdmin) {
    newBalance = balance - HEARTS_PER_MESSAGE;
    await db.ledgerEntry.create({
      data: {
        userId: session.user.id,
        type: "MESSAGE_SPEND",
        amount: -HEARTS_PER_MESSAGE,
        balanceAfter: newBalance,
        referenceId: encounterId,
        note: `Message in encounter ${encounterId}`,
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
    balance: newBalance,
  });
}
