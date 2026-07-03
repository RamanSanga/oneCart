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
import heroMen   from "../assets/hero_men.jpg";
import heroWomen from "../assets/hero_women.jpg";
import heroStreet from "../assets/hero_women_street.jpg";

const HERO_SLIDES = [
  { text1: "Quiet Luxury",      text2: "Elevated Essentials for Daily Wear" },
  { text1: "New Arrivals",      text2: "The Season's Most Considered Pieces" },
  { text1: "Timeless Design",   text2: "Crafted for the Modern Wardrobe" },
];

const CATEGORY_TILES = [
  { label: "Men",   image: catMen,   path: "/collection?category=Men", count: "12 Items" },
  { label: "Women", image: catWomen, path: "/collection?category=Women", count: "18 Items" },
  { label: "Kids",  image: catKids,  path: "/collection?category=Kids", count: "8 Items" },
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
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 bg-[var(--cream)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)] mb-2">Departments</p>
            <h2
              className="font-display font-light tracking-tight text-[var(--ink)] leading-tight"
              style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
            >
              Shop by Silhouette
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {CATEGORY_TILES.map(tile => (
              <Link
                key={tile.label}
                to={tile.path}
                className="group relative overflow-hidden block bg-[#EEECEA]"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                />
                {/* luxurious tint overlay */}
                <div className="absolute inset-0 bg-[var(--ink)]/15 group-hover:bg-[var(--ink)]/30 transition-colors duration-500 ease-out" />
                
                {/* elegant text overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <span className="text-white/60 text-[9px] font-medium uppercase tracking-[0.25em] self-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {tile.count}
                  </span>
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="text-white font-display font-light text-[24px] tracking-wide mb-1">
                      {tile.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-[9px] font-semibold uppercase tracking-[0.2em]">Explore</span>
                      <div className="w-6 h-px bg-white/50 group-hover:w-10 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <LatestCollection />

      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 bg-white border-y border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 aspect-[3/4] overflow-hidden bg-[#EEECEA]">
            <img 
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" 
              alt="Model wearing camel coat walking cobblestone street" 
              className="w-full h-full object-cover object-center hover:scale-[1.02] transition-transform duration-700" 
              loading="lazy"
            />
          </div>
          {/* right text */}
          <div className="lg:col-span-7 space-y-8 max-w-xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)]">Our Philosophy</p>
            <h2 className="font-display font-light leading-[1.1] tracking-tight text-[var(--ink)]"
                style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}>
              We don't design trends. We design pieces that <em className="italic">outlast</em> them.
            </h2>
            <p className="text-[13px] font-light leading-relaxed text-[var(--ink-60)]">
              At OneCart, we believe that wardrobe longevity is the ultimate luxury. Every silhouette is refined, every texture curated, and every design constructed with materials sourced sustainably. By pairing minimalist aesthetics with premium fabrics, we build clothing designed to transcend season and year.
            </p>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-60)] hover:border-[var(--ink-60)] transition-colors"
              >
                Discover Our Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <BestSeller />

      {/* ── EDITORIAL LOOKBOOK ── */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 bg-[var(--cream)] border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* left text */}
          <div className="lg:col-span-7 space-y-8 max-w-xl order-2 lg:order-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)]">The Campaign</p>
            <h2 className="font-display font-light leading-[1.1] tracking-tight text-[var(--ink)]"
                style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}>
              Crafted with care, worn with <em className="italic">intention</em>.
            </h2>
            <p className="text-[13px] font-light leading-relaxed text-[var(--ink-60)]">
              Our latest campaign highlights natural fibers, relaxed silhouettes, and the beauty of quiet confidence. Shot under the soft sunlight of Copenhagen, this collection celebrates clean lines and neutral tones that harmonize effortlessly with a modern lifestyle.
            </p>
            <div className="pt-4">
              <Link
                to="/collection"
                className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-60)] hover:border-[var(--ink-60)] transition-colors"
              >
                Browse Campaign Pieces →
              </Link>
            </div>
          </div>
          {/* right image */}
          <div className="lg:col-span-5 aspect-[3/4] overflow-hidden bg-[#EEECEA] order-1 lg:order-2">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
              alt="Model wearing oversized coat in Scandinavian living room" 
              className="w-full h-full object-cover object-center hover:scale-[1.02] transition-transform duration-700" 
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />

      {/* ── FOOTER ── */}
      <OurPolicy />
    </div>
  );
}

export default Home;
