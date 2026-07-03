import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroPremium from "../component/HeroPremium";
import InfiniteMarquee from "../component/InfiniteMarquee";
import LatestCollection from "../component/LatestCollection";
import BestSeller from "../component/BestSeller";
import Newsletter from "../component/NewLetterBox";
import OurPolicy from "../component/OurPolicy";

import catMen   from "../assets/cat_men.jpg";
import catWomen from "../assets/cat_women.jpg";
import catKids  from "../assets/cat_kids.jpg";

const HERO_SLIDES = [
  { text1: "Quiet Luxury",      text2: "Elevated Essentials for Daily Wear" },
  { text1: "New Arrivals",      text2: "The Season's Most Considered Pieces" },
  { text1: "Timeless Design",   text2: "Crafted for the Modern Wardrobe" },
];

const CATEGORY_TILES = [
  { label: "Men",   image: catMen,   path: "/collection?category=Men" },
  { label: "Women", image: catWomen, path: "/collection?category=Women" },
  { label: "Kids",  image: catKids,  path: "/collection?category=Kids" },
];


function Home() {
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--cream)]">

      {/* ── HERO ── */}
      <HeroPremium
        heroData={HERO_SLIDES[heroCount]}
        heroCount={heroCount}
        totalSlides={HERO_SLIDES.length}
      />

      {/* ── MARQUEE ── */}
      <InfiniteMarquee />

      {/* ── CATEGORY EDITORIAL GRID ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 bg-[var(--cream)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">Shop by</p>
            <h2
              className="font-display font-light tracking-tight text-[var(--ink)] leading-tight"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              Departments
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {CATEGORY_TILES.map(tile => (
              <Link
                key={tile.label}
                to={tile.path}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: "2/3" }}
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* overlay */}
                <div className="absolute inset-0 bg-[var(--ink)]/20 group-hover:bg-[var(--ink)]/35 transition-colors duration-300" />
                {/* label */}
                <div className="absolute bottom-5 left-5">
                  <p className="text-white text-[10px] font-semibold uppercase tracking-[0.2em]">{tile.label}</p>
                  <p className="text-white/60 text-[10px] mt-0.5 tracking-wide">Shop Now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <LatestCollection />

      {/* ── BRAND STATEMENT ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 bg-[var(--cream)] border-t border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-8">Our Philosophy</p>
          <p
            className="font-display font-light italic leading-[1.1] text-[var(--ink)] max-w-3xl"
            style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
          >
            "We don't design trends.<br />We design things that outlast them."
          </p>
          <div className="mt-10 h-px w-16 bg-[var(--border-strong)]" />
          <Link
            to="/about"
            className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors"
          >
            Our Story →
          </Link>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <BestSeller />

      {/* ── NEWSLETTER ── */}
      <Newsletter />

      {/* ── FOOTER ── */}
      <OurPolicy />
    </div>
  );
}

export default Home;
