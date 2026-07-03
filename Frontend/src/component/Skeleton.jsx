import React from "react";

/**
 * Skeleton placeholder — uses CSS shimmer animation.
 * type: "card" | "text" | "line"
 */
function Skeleton({ type = "card", count = 1 }) {
  if (type === "card") {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3">
        {/* image placeholder — 3:4 ratio */}
        <div className="w-full skeleton-shimmer" style={{ aspectRatio: "3/4" }} />
        {/* text placeholders */}
        <div className="h-[13px] w-3/4 skeleton-shimmer" />
        <div className="h-[13px] w-1/3 skeleton-shimmer" />
      </div>
    ));
  }
  if (type === "line") {
    return <div className="h-[13px] w-full skeleton-shimmer rounded-none" />;
  }
  return <div className="h-8 w-full skeleton-shimmer" />;
}

export default Skeleton;
