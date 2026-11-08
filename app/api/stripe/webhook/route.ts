import StripeClient from "stripe";
import { billingServerClients } from "@/lib/members/checkout";
import { synchronizeMembership } from "@/lib/members/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key)
    return new Response("Webhook not configured", { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  let event: StripeClient.Event;
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 1_048_576)
      return new Response("Payload too large", { status: 413 });
    event = new StripeClient(key).webhooks.constructEvent(
      body,
      signature,
      secret,
    );
  } catch {
    return new Response("Invalid signature or payload", { status: 400 });
  }
  try {
    const { stripe, database, prices, livemode } = billingServerClients();
    if (event.livemode !== livemode || event.account) {
      return new Response("Wrong Stripe environment", { status: 400 });
    }
    await synchronizeMembership(
      event,
      stripe,
      database,
      Object.values(prices) as string[],
    );
    return Response.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook synchronization failed", {
      eventId: event.id,
      eventType: event.type,
      type: error instanceof Error ? error.name : "database_error",
    });
    return new Response("Webhook processing failed", { status: 500 });
  }
}
