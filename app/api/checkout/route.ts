import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { items } = await req.json();

    const lineItems = items.map((item: {
      name: string;
      price: number;
      qty: number;
      imageUrl: string | null;
    }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    const stripeError = error as { message?: string; code?: string; type?: string };
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: stripeError.message,
        code: stripeError.code,
        type: stripeError.type,
      },
      { status: 500 }
    );
  }
}