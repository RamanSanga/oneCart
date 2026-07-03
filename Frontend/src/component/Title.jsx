import React from "react";

/**
 * Section title component — editorial, no yellow bar.
 * text1: muted label (e.g. "YOUR")
 * text2: emphasized (e.g. "SHOPPING BAG")
 */
function Title({ text1, text2 }) {
  return (
    <div className="mb-10">
      <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-3">
        {text1}
      </p>
      <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[var(--ink)] font-display">
        {text2}
      </h2>
      <div className="mt-4 h-px w-12 bg-[var(--border-strong)]" />
    </div>
  );
}

export default Title;
