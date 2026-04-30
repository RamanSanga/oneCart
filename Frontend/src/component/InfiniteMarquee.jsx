import React from "react";

export default function InfiniteMarquee() {
  const textItems = [
    "ONECART EXCLUSIVE",
    "PREMIUM QUALITY",
    "LUXURY REDEFINED",
    "MODERN LIFESTYLE",
    "NEW ARRIVALS",
    "LIMITED EDITION",
  ];

  // Duplicate the list once so CSS translate loops smoothly
  const items = [...textItems, ...textItems];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white py-4 border-y border-white/20 flex items-center z-30">
      <div className="absolute left-0 w-32 h-full bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 w-32 h-full bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="w-full">
        <div className="marquee-track">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-80">
                {item}
              </span>
              <span className="mx-6 text-white/30 text-[8px]">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
