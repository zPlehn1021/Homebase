"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What if I sell my home?",
    answer:
      "Your Homebase account stays with you. When you move, simply update your home profile in settings with your new property details and regenerate your maintenance plan. Your custom tasks and history are always yours.",
  },
  {
    question: "Can I add my own custom tasks?",
    answer:
      "Absolutely. While Homebase generates a personalized plan based on your home, you can add unlimited custom tasks for anything specific to your property — from that leaky faucet to annual chimney cleaning.",
  },
  {
    question: "What kinds of homes does this work for?",
    answer:
      "Homebase works for houses, condos, townhouses, and apartments. During setup, you tell us about your property type, age, size, and systems (HVAC, pool, septic, etc.) so we can tailor your maintenance plan accordingly.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Your data is stored securely and is never shared with third parties. You can export all of your data at any time from the Settings page, and you can delete your account entirely if you choose.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "Nope. Homebase is a web app that works in any modern browser on desktop, tablet, or phone. There's nothing to download or install — just sign in and go.",
  },
  {
    question: "How is Homebase free?",
    answer:
      "We believe every homeowner deserves great maintenance tools. Homebase is funded by optional donations from users who find it valuable. If you love it, consider supporting the project — but there's no obligation.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto divide-y divide-stone-200">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-base font-semibold text-stone-800 pr-4 group-hover:text-sage-700 transition-colors">
              {faq.question}
            </span>
            <span className="shrink-0 text-stone-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              >
                <path d="M5 7.5l5 5 5-5" />
              </svg>
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === i ? "max-h-96 pb-5" : "max-h-0"
            }`}
          >
            <p className="text-sm text-stone-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
