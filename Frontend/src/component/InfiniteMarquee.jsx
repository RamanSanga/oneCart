import React from "react";

const ITEMS = [
  "Free Shipping on Orders over ₹2,000",
  "New Arrivals Every Week",
  "100% Authentic Products",
  "Easy 30-Day Returns",
  "Sustainably Sourced Materials",
  "Secure Checkout · Razorpay",
];

export default function InfiniteMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-[var(--border)] bg-white py-3.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 shrink-0 mr-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ink-60)]">
              {item}
            </span>
            <span className="text-[var(--ink-20)] text-base">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
