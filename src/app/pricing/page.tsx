import { redirect } from "next/navigation";

export default function PricingPage() {
  const checkoutUrl = process.env.LEMONSQUEEZY_CHECKOUT_URL;

  // If checkout URL is configured, redirect to LemonSqueezy
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  // Fallback: redirect to the landing page pricing section
  redirect("/#pricing");
}
