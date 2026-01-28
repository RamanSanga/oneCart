import React from "react";

function Newsletter() {
  return (
    <section className="relative w-full mt-32 overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]" />

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center text-white">
        
        {/* SMALL LABEL */}
        <p className="uppercase tracking-[0.3em] text-xs text-white/70 mb-6">
          OneCart Exclusive
        </p>

        {/* MAIN TITLE */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
          20% Off Your First Order
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-6 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
          OneCart is designed for your first experience with us.
          Enjoy an exclusive <span className="text-white font-medium">20% welcome offer </span> 
          on your very first purchase.  
          This benefit is available once — because great beginnings deserve something special.
        </p>

        {/* FOOT NOTE */}
        <p className="mt-10 text-xs tracking-wide text-white/60">
          *First-time customers only · Automatically applied at checkout
        </p>
      </div>
    </section>
  );
}

export default Newsletter;
