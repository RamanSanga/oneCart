import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import heroMen    from "../assets/hero_men.jpg";
import heroWomen  from "../assets/hero_women.jpg";
import heroStreet from "../assets/hero_women_street.jpg";
import catMen     from "../assets/cat_men.jpg";

const HERO_IMAGES = [heroMen, heroWomen, heroStreet, catMen];

/**
 * Full-viewport editorial hero.
 * Left column: large Playfair headline + text CTA.
 * Right column: full-bleed fashion image, no border.
 */
export default function HeroPremium({ heroData, heroCount = 0, totalSlides = 1 }) {
  const title    = heroData?.text1 || "Premium Quality";
  const subtitle = heroData?.text2 || "Designed for the modern wardrobe";

  return (
    <section
      className="relative w-full overflow-hidden bg-[var(--cream)]"
      style={{ minHeight: "100svh" }}
    >
      {/* Background image (right half) — fills entire viewport */}
      <div className="absolute inset-0 md:left-[50%]">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroCount}
            src={HERO_IMAGES[heroCount % HERO_IMAGES.length]}
            alt="Editorial collection"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* soft cream fade on the left edge so text is legible */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--cream)] to-transparent md:hidden" />
      </div>

      {/* Cream overlay on mobile so text is always readable */}
      <div className="absolute inset-0 bg-[var(--cream)]/80 md:hidden pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex items-center"
        style={{ minHeight: "100svh" }}
      >
        {/* Left column — takes 50% on desktop */}
        <div className="w-full md:w-1/2 py-32 md:py-0 flex flex-col justify-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={`${heroCount}-content`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8 max-w-xl"
            >
              {/* Label */}
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)]">
                OneCart / {new Date().getFullYear()} Collection
              </p>

              {/* Headline */}
              <h1 className="font-display font-light leading-[1.05] tracking-tight text-[var(--ink)]"
                  style={{ fontSize: "clamp(42px, 6vw, 84px)" }}>
                {title}
                <br />
                <em className="font-display italic text-[var(--ink-60)]" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
                  {subtitle}
                </em>
              </h1>

              {/* Body */}
              <p className="text-[13px] font-light leading-relaxed text-[var(--ink-60)] max-w-[38ch]">
                Curated pieces for the considered wardrobe — where quiet luxury meets everyday intention.
              </p>

              {/* CTA */}
              <Link
                to="/collection"
                className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-60)] hover:border-[var(--ink-60)] transition-colors"
              >
                Explore the Collection
                <span className="text-base leading-none">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Slide counter */}
          <div className="absolute bottom-10 left-6 md:left-10 lg:left-16 text-[10px] font-medium text-[var(--ink-40)] tracking-widest">
            0{heroCount + 1} — 0{totalSlides}
          </div>
        </div>
      </div>
    </section>
  );
}
