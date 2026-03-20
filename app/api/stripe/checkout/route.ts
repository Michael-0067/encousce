import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { stripe } from "@/lib/stripe";

const MIN_HEARTS = 500;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { hearts } = await req.json();
  const qty = Math.floor(Number(hearts));

  if (!qty || qty < MIN_HEARTS) {
    return NextResponse.json(
      { error: `Minimum purchase is ${MIN_HEARTS} Hearts ($${(MIN_HEARTS / 100).toFixed(2)}).` },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 1, // 1 cent per Heart
          product_data: {
            name: `♥ ${qty.toLocaleString()} Hearts`,
            description: "Encousce Hearts — spend on encounters",
          },
        },
        quantity: qty,
      },
    ],
    metadata: {
      userId: session.user.id,
      hearts: qty.toString(),
    },
    success_url: `${appUrl}/account/hearts?success=true`,
    cancel_url: `${appUrl}/account/hearts`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
