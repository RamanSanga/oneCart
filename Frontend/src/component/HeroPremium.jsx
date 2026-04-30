import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap } from "react-icons/fi";
import "../animations.css";
import back1 from "../assets/back1.png";
import back5 from "../assets/back5.png";
import back8 from "../assets/back8.png";
import back6 from "../assets/back6.png";

const heroFrames = [
  back8,
  back5,
  back1,
  back6,
];

export default function HeroPremium({ heroData, heroCount = 0, totalSlides = 1 }) {
  const title = heroData?.text1 || "Premium Quality";
  const subtitle = heroData?.text2 || "Designed For Modern Lifestyle";

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener ? media.addEventListener("change", update) : media.addListener(update);
    return () => {
      media.removeEventListener ? media.removeEventListener("change", update) : media.removeListener(update);
    };
  }, []);

  return (
    <section className="hero-gradient relative isolate overflow-hidden text-white min-h-screen flex items-center py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(255,215,128,0.10),transparent_18%),linear-gradient(180deg,rgba(2,2,4,0.22),rgba(2,2,4,0.62))]" />
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/8 blur-3xl"
        animate={{ x: [0, 35, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-120 h-120 rounded-full bg-yellow-300/10 blur-3xl"
        animate={{ x: [0, -35, 0], y: [0, -20, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative container mx-auto px-6">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] items-center gap-10 lg:gap-16">
          <div className="max-w-3xl">

            <AnimatePresence mode="wait">
              <motion.div
                key={`${heroCount}-${title}-${subtitle}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8"
              >
                  <motion.h1
                    initial={{ filter: "blur(8px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-[-0.05em] max-w-4xl"
                  >
                  {title}
                  <span className="block text-white/75 font-light mt-3">{subtitle}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
                  className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-white/68"
                >
                  Premium picks, fast checkout, and a quieter, more considered storefront. Built to feel like a luxury magazine cover rather than a typical shop.
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-[11px] uppercase tracking-[0.35em] text-white/30">
              Slide {heroCount + 1} of {totalSlides}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
              <motion.div
                className="glass relative overflow-hidden rounded-4xl border border-white/10 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_38%,rgba(255,255,255,0.03))]" />

              <div className="relative grid grid-cols-12 gap-3 min-h-[480px] lg:min-h-[620px]">
                <motion.div
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
                  className="col-span-12 md:col-span-7 relative overflow-hidden rounded-4xl border border-white/10 bg-black/20 min-h-[380px] md:min-h-0"
                >
                  <img
                    src={heroFrames[heroCount % heroFrames.length]}
                    alt="Hero fashion edit"
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                </motion.div>

                {isDesktop && (
                  <div className="col-span-12 md:col-span-5 grid gap-3">
                    {heroFrames.slice(0, 3).map((frame, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * index }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/25 min-h-[calc((620px-24px)/3)]"
                      >
                        <img src={frame} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-85" loading="lazy" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
