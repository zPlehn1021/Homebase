import Link from "next/link";
import Image from "next/image";
import { LandingNav } from "@/components/landing/landing-nav";
import { FAQSection } from "@/components/landing/faq-section";

const DONATION_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_DONATION_URL || "/#pricing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Homebase",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Your personalized home maintenance plan. Seasonal reminders, cost tracking, inventory management, and smart scheduling.",
  url: "https://homebase.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

/* ─────────────────────── Main Page ─────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-full bg-warm-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNav />

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-sage-100/40 blur-3xl" />
        <div className="absolute top-40 -right-24 w-80 h-80 rounded-full bg-sage-50/60 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-stone-900 tracking-tight leading-[1.1]">
              Your home remembers
              <br />
              <span className="text-sage-600">everything.</span>
              <br />
              <span className="text-stone-400 text-3xl sm:text-4xl lg:text-[2.6rem]">
                Now you can too.
              </span>
            </h1>

            <p className="mt-6 text-lg text-stone-500 leading-relaxed max-w-xl mx-auto">
              Homebase builds a personalized maintenance plan for your home and
              reminds you before small tasks become expensive problems.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-sage-600 text-white font-semibold text-base hover:bg-sage-700 transition-colors shadow-md shadow-sage-600/20"
              >
                Get Started &mdash; It&apos;s Free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-700 font-semibold text-base hover:border-sage-300 hover:text-sage-700 transition-colors"
              >
                Learn More
              </a>
            </div>

            <p className="mt-4 text-xs text-stone-400">
              100% free. No credit card required. Donations welcome.
            </p>
          </div>

          {/* Hero Screenshot */}
          <div className="mt-12 relative">
            <div className="absolute -inset-4 bg-sage-100/40 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-stone-200 shadow-2xl shadow-stone-900/10 overflow-hidden">
              <Image
                src="/screenshots/dashboard.png"
                alt="Homebase dashboard showing maintenance tasks, completion stats, and action items"
                width={1400}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ PROBLEM ════════════════════ */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Your home is your biggest investment.
              <br />
              <span className="text-sage-600">Are you protecting it?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-cream rounded-2xl border border-stone-200 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-2">Forgotten maintenance</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Most homeowners miss routine tasks until they become visible
                problems. By then, a $50 fix has turned into a $5,000 repair.
              </p>
            </div>

            <div className="bg-cream rounded-2xl border border-stone-200 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-2">Surprise repair costs</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Without a plan, every breakdown is an emergency. You end up
                paying premium prices for urgent fixes that could have been prevented.
              </p>
            </div>

            <div className="bg-cream rounded-2xl border border-stone-200 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-2">No system to track it all</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Sticky notes and mental checklists don&apos;t scale. Your home
                has dozens of systems that each need attention on different schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section id="features" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-sage-600 tracking-wide uppercase mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Everything your home needs,
              <br />
              nothing it doesn&apos;t.
            </h2>
          </div>

          {/* Feature 1: Task Management */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24">
            <div>
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="16" height="15" rx="2" />
                  <path d="M3 9h16M7 2v4M15 2v4" />
                  <path d="M8 13h2M12 13h2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                Personalized task management
              </h3>
              <p className="text-base text-stone-500 leading-relaxed mb-4">
                Homebase generates a complete maintenance plan based on your
                specific home. Filter by category, track due dates, and never
                miss a seasonal task again. Add your own custom tasks alongside
                the auto-generated ones.
              </p>
              <ul className="space-y-2">
                {[
                  "Auto-generated tasks for your home type",
                  "Filter by plumbing, HVAC, electrical, and more",
                  "Track overdue, upcoming, and completed tasks",
                  "Add unlimited custom tasks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="8" fill="#f6f7f5" />
                      <path d="M5 8l2 2 4-4" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-sage-100/30 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
                <Image
                  src="/screenshots/tasks.png"
                  alt="My Tasks view showing categorized maintenance tasks with filters and due dates"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Inventory */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24">
            <div className="lg:order-2">
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7l8-4 8 4M3 7v8l8 4M3 7l8 4M19 7v8l-8 4M19 7l-8 4M11 11v8" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                Home inventory tracking
              </h3>
              <p className="text-base text-stone-500 leading-relaxed mb-4">
                Keep a detailed record of every major system, appliance, and
                piece of equipment in your home. Track manufacturers, model
                numbers, conditions, locations, and purchase dates — all in one
                place.
              </p>
              <ul className="space-y-2">
                {[
                  "Track appliances, HVAC, plumbing, and more",
                  "Record manufacturer, model, and serial numbers",
                  "Monitor condition from new to needs replacement",
                  "Link inventory items to maintenance tasks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="8" fill="#f6f7f5" />
                      <path d="M5 8l2 2 4-4" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:order-1">
              <div className="absolute -inset-3 bg-sage-100/30 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
                <Image
                  src="/screenshots/inventory.png"
                  alt="Inventory page showing home equipment, appliances, and systems with conditions and locations"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 3: Schedule */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24">
            <div>
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="16" height="15" rx="2" />
                  <path d="M3 9h16M7 2v4M15 2v4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                Visual maintenance calendar
              </h3>
              <p className="text-base text-stone-500 leading-relaxed mb-4">
                See your entire maintenance schedule at a glance with a
                color-coded calendar. Spot overdue tasks, upcoming due dates,
                and plan your weekends around what your home actually needs.
              </p>
              <ul className="space-y-2">
                {[
                  "Monthly calendar with task indicators",
                  "Color-coded by status: overdue, due soon, upcoming",
                  "Switch between calendar and list views",
                  "Plan maintenance around your schedule",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="8" fill="#f6f7f5" />
                      <path d="M5 8l2 2 4-4" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-sage-100/30 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
                <Image
                  src="/screenshots/schedule.png"
                  alt="Schedule calendar view showing monthly maintenance tasks with color-coded indicators"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 4: Cost Tracking */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24">
            <div className="lg:order-2">
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M11 7v8M9 9.5a2 2 0 012-1.5h1a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h1a2 2 0 002-1.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                Cost tracking &amp; spending insights
              </h3>
              <p className="text-base text-stone-500 leading-relaxed mb-4">
                Understand the true cost of homeownership. Track what you spend
                on maintenance, see category breakdowns, and compare spending
                year over year to budget smarter.
              </p>
              <ul className="space-y-2">
                {[
                  "Track total spending and per-task costs",
                  "See completion rate and task stats",
                  "Category-based spending breakdown",
                  "Year-over-year comparison as data grows",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="8" fill="#f6f7f5" />
                      <path d="M5 8l2 2 4-4" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:order-1">
              <div className="absolute -inset-3 bg-sage-100/30 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
                <Image
                  src="/screenshots/costs.png"
                  alt="Costs page showing spending breakdown, completion rates, and yearly comparisons"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 5 & 6: Smaller feature cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Smart Reminders */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 3a6 6 0 016 6c0 3.09-1.13 5.82-3 7h-6c-1.87-1.18-3-3.91-3-7a6 6 0 016-6z" />
                  <path d="M9 16v1a2 2 0 004 0v-1" />
                  <path d="M11 3V1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">
                Gentle nudges, not nagging
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Choose when you want reminders — day-of, a few days ahead, or a
                week before. Get a weekly digest of what&apos;s coming up so
                nothing falls through the cracks.
              </p>
              <div className="mt-5 bg-sage-50 rounded-xl border border-sage-100 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sage-200 flex items-center justify-center">
                    <span className="text-xs">📧</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-sage-800">
                      Reminder: Clean gutters
                    </p>
                    <p className="text-[10px] text-sage-500">Due in 3 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
              <div className="w-11 h-11 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11.5L11 5l8 6.5" />
                  <path d="M5 10v7a1 1 0 001 1h4v-5h2v5h4a1 1 0 001-1v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">
                Built around your actual home
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Tell us about your property — type, age, square footage, and
                systems like HVAC, pool, or septic. We generate a plan that fits
                your home, not a generic checklist.
              </p>
              <div className="mt-5 relative rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <Image
                  src="/screenshots/settings.png"
                  alt="Settings page showing home profile customization options"
                  width={700}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-sage-600 tracking-wide uppercase mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-14 left-[20%] right-[20%] h-px border-t-2 border-dashed border-stone-200" />

            {[
              {
                step: "1",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.5L14 8l10 6.5" />
                    <path d="M6 13v8a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1v-8" />
                  </svg>
                ),
                title: "Tell us about your home",
                description: "Property type, age, size, and systems. Takes about 2 minutes.",
              },
              {
                step: "2",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="5" width="20" height="18" rx="3" />
                    <path d="M4 11h20M10 3v4M18 3v4" />
                    <path d="M10 15l2.5 2.5L17 13" />
                  </svg>
                ),
                title: "Get your personalized plan",
                description: "We generate a year-round maintenance schedule tailored to your home.",
              },
              {
                step: "3",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="14" cy="14" r="10" />
                    <path d="M10 14l3 3 5-5" />
                  </svg>
                ),
                title: "Stay on top of maintenance",
                description: "Check off tasks, track costs, and get reminders so nothing slips.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-center relative z-10 bg-warm-white">
                  {item.icon}
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center z-20">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ PRICING ════════════════════ */}
      <section id="pricing" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-sage-600 tracking-wide uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Free for everyone.
            </h2>
            <p className="mt-3 text-stone-500">
              Every feature, every tool, no credit card required.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-sage-600 shadow-xl shadow-sage-600/10 overflow-hidden">
              <div className="bg-sage-600 px-6 py-8 text-center">
                <p className="text-sage-200 text-sm font-semibold uppercase tracking-wide mb-2">
                  Full Access
                </p>
                <p className="text-5xl font-bold text-white">Free</p>
                <p className="text-sage-200 text-sm mt-2">
                  Everything included, no strings attached
                </p>
              </div>

              <div className="px-6 py-8">
                <ul className="space-y-3.5">
                  {[
                    "Personalized maintenance plan",
                    "Seasonal task scheduling",
                    "Home inventory management",
                    "Email reminders & weekly digest",
                    "Cost tracking & yearly reports",
                    "Visual maintenance calendar",
                    "Unlimited custom tasks",
                    "Works on any device",
                    "All future updates included",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5">
                        <circle cx="9" cy="9" r="9" fill="#f6f7f5" />
                        <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#5e6c51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center px-6 py-3.5 rounded-2xl bg-sage-600 text-white font-semibold text-base hover:bg-sage-700 transition-colors shadow-md shadow-sage-600/20"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>

              <div className="bg-sage-50 border-t border-sage-100 px-6 py-5 text-center">
                <p className="text-sm text-stone-600 mb-3">
                  Love Homebase? Help keep it free for everyone.
                </p>
                <a
                  href={DONATION_URL}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-sage-300 text-sage-700 text-sm font-semibold hover:bg-sage-100 transition-colors"
                >
                  <span>&#9825;</span>
                  Support Homebase
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section id="faq" className="bg-white border-y border-stone-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-sage-600 tracking-wide uppercase mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Questions? Answers.
            </h2>
          </div>
          <FAQSection />
        </div>
      </section>

      {/* ════════════════════ FINAL CTA ════════════════════ */}
      <section className="bg-sage-50 border-b border-sage-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
            Your home takes care of you.
            <br />
            <span className="text-sage-600">It&apos;s time to return the favor.</span>
          </h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Join homeowners who never miss a maintenance task again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-sage-600 text-white font-semibold text-base hover:bg-sage-700 transition-colors shadow-md shadow-sage-600/20"
            >
              Get Started Free
            </Link>
            <a
              href={DONATION_URL}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border-2 border-stone-200 bg-white text-stone-700 font-semibold text-base hover:border-sage-300 hover:text-sage-700 transition-colors"
            >
              Support Homebase
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="bg-warm-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏡</span>
              <span className="text-sm font-semibold text-stone-700">Homebase</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/privacy" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:hello@homebase.app" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Contact
              </a>
            </div>

            <p className="text-xs text-stone-300">
              &copy; {new Date().getFullYear()} Homebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
