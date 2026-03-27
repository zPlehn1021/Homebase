import { redirect } from "next/navigation";

export default function PricingPage() {
  // Redirect to the landing page pricing section (now shows free + donation info)
  redirect("/#pricing");
}
