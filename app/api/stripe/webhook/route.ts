import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const heartsStr = session.metadata?.hearts;

    if (!userId || !heartsStr) {
      return NextResponse.json({ error: "Missing metadata." }, { status: 400 });
    }

    const heartsQty = parseInt(heartsStr, 10);
    const amountCents = session.amount_total ?? heartsQty;

    // Idempotency — skip if this session was already processed
    const existing = await db.purchase.findUnique({
      where: { stripePaymentId: session.id },
    });
    if (existing) return NextResponse.json({ ok: true });

    // Atomic: create purchase record + ledger entry in one transaction
    await db.$transaction(async (tx) => {
      const current = await tx.ledgerEntry.aggregate({
        where: { userId },
        _sum: { amount: true },
      });
      const currentBalance = current._sum.amount ?? 0;
      const newBalance = currentBalance + heartsQty;

      await tx.purchase.create({
        data: {
          userId,
          heartsAmount: heartsQty,
          amountUsdCents: amountCents,
          stripePaymentId: session.id,
          status: "COMPLETE",
        },
      });

      await tx.ledgerEntry.create({
        data: {
          userId,
          type: "PURCHASE",
          amount: heartsQty,
          balanceAfter: newBalance,
          referenceId: session.id,
          note: `Purchased ${heartsQty.toLocaleString()} Hearts`,
        },
      });
    });
  }

  return NextResponse.json({ ok: true });
}
