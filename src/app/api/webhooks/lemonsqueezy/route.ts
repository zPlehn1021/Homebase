import { createHmac } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, purchases } from "@/db/schema";

export const dynamic = "force-dynamic";

function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const hmac = createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return signature === digest;
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return Response.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifySignature(rawBody, signature, secret)) {
    console.error("LemonSqueezy webhook signature verification failed");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    // Only handle order_completed events
    if (eventName !== "order_completed") {
      return Response.json({ received: true });
    }

    const attributes = payload.data?.attributes;
    if (!attributes) {
      console.error("LemonSqueezy webhook missing data.attributes");
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const customerEmail = attributes.user_email as string;
    const orderId = String(payload.data.id);
    const totalCents = attributes.total as number;

    if (!customerEmail || !orderId) {
      console.error("LemonSqueezy webhook missing email or order ID");
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Idempotency check — skip if this order was already processed
    const existingPurchase = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(eq(purchases.lemonSqueezyOrderId, orderId))
      .limit(1);

    if (existingPurchase.length > 0) {
      return Response.json({ received: true, duplicate: true });
    }

    // Look up user by email
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, customerEmail.toLowerCase()))
      .limit(1);

    const userId = existingUser[0]?.id ?? null;

    // Insert purchase record
    await db.insert(purchases).values({
      userId,
      email: customerEmail.toLowerCase(),
      lemonSqueezyOrderId: orderId,
      amount: totalCents,
    });

    // If user exists, mark them as verified
    if (userId) {
      await db
        .update(users)
        .set({ purchaseVerified: true })
        .where(eq(users.id, userId));
    }

    console.log(
      `LemonSqueezy purchase processed: order=${orderId} email=${customerEmail} userId=${userId}`
    );

    return Response.json({ received: true, verified: !!userId });
  } catch (error) {
    console.error("LemonSqueezy webhook error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
