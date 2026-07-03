import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Newsletter from "../component/NewLetterBox";
import OurPolicy from "../component/OurPolicy";

// Campaign images — completely unique editorial shots
const STORY_IMAGE  = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop";
const CRAFT_IMAGE  = "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1000&auto=format&fit=crop";
const DETAIL_IMAGE = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop";
const MATERIALS_IMAGE = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop";

const VALUES = [
  {
    number: "01",
    title: "Ethical Sourcing",
    body: "We partner exclusively with certified suppliers who prioritize fair labor practices and environmental responsibility. Every material is traced from source to shelf.",
  },
  {
    number: "02",
    title: "Precision Design",
    body: "Each silhouette is prototyped and refined over months to achieve the exact balance of form and function. We reject the first 90% of what we make.",
  },
  {
    number: "03",
    title: "Lasting Quality",
    body: "We build our pieces to be worn for years, not seasons. Premium long-staple fibers, superior construction, and a finish that improves with age.",
  },
];

const STATS = [
  { value: "2024",  label: "Established" },
  { value: "48+",   label: "Artisan Partners" },
  { value: "120+",  label: "Cities Reached" },
  { value: "99%",   label: "Quality Rating" },
];

function About() {
  /* ---- scroll reveal ---- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .scale-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[var(--cream)] text-[var(--ink)] overflow-x-hidden" style={{ paddingTop: "var(--nav-height)" }}>

      {/* ── HERO ── */}
      <section className="min-h-[90vh] flex items-center px-6 md:px-10 lg:px-16 py-24 border-b border-[var(--border)] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
          {/* text */}
          <div className="max-w-xl">
            <p className="reveal text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)] mb-8">
              Est. 2024 — OneCart Anthology
            </p>
            <h1 className="reveal reveal-delay-1 font-display font-light leading-[1.05] tracking-tight text-[var(--ink)] mb-10"
                style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
              The art of{" "}
              <em className="italic">intentional</em>
              <br />living and style.
            </h1>
            <p className="reveal reveal-delay-2 text-[14px] font-light leading-relaxed text-[var(--ink-60)] max-w-[42ch] mb-10">
              We create timeless essentials designed to transcend seasons and celebrate the beauty of minimalist craftsmanship.
            </p>
            <Link
              to="/collection"
              className="reveal reveal-delay-3 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-1 hover:text-[var(--ink-60)] hover:border-[var(--ink-60)] transition-colors"
            >
              Explore the Collection →
            </Link>
          </div>

          {/* image */}
          <div className="scale-reveal hidden md:block h-[60vh] overflow-hidden">
            <img src={STORY_IMAGE} alt="Fashion editorial" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 bg-white border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="reveal font-display font-light italic leading-[1.1] text-[var(--ink-60)] max-w-5xl"
             style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
            "We don't make clothes. We make intentions — the quiet confidence that comes from wearing something built to last."
          </p>
          <div className="mt-8 h-px w-12 bg-[var(--border-strong)]" />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">
            OneCart, 2024
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="scale-reveal order-2 lg:order-1 overflow-hidden aspect-[4/5]">
            <img src={DETAIL_IMAGE} alt="Craftsmanship detail" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2 max-w-lg">
            <p className="reveal text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-6">Our Philosophy</p>
            <h2 className="reveal reveal-delay-1 font-display font-light leading-tight text-[var(--ink)] mb-10"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              Where every <em className="italic">thread</em><br />tells a story.
            </h2>
            <div className="space-y-6 text-[13px] font-light leading-relaxed text-[var(--ink-60)]">
              <p className="reveal reveal-delay-2">
                OneCart was born from a simple realization: the world has too much noise, and not enough silence. We set out to create a sanctuary of style where quality takes precedence over quantity.
              </p>
              <p className="reveal reveal-delay-3">
                Our pieces are not just products — they are investments in craftsmanship. We work with artisans who have spent decades perfecting their trade, ensuring that every stitch meets our exacting standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 bg-white border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
              <p className="font-display font-light italic text-[var(--ink)] mb-2 leading-none"
                 style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>
                {s.value}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREMIUM MATERIALS ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 border-b border-[var(--border)] bg-[var(--cream)]">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="max-w-lg">
            <p className="reveal text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-6">Honest Textures</p>
            <h2 className="reveal reveal-delay-1 font-display font-light leading-tight text-[var(--ink)] mb-10"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              The touch of <em className="italic">fine</em> materials.
            </h2>
            <div className="space-y-6 text-[13px] font-light leading-relaxed text-[var(--ink-60)]">
              <p className="reveal reveal-delay-2">
                We select only premium, certified natural fibers. From extra-fine organic cotton and long-staple linen to high-grade wools, our fabrics are selected for their texture, comfort, and durability.
              </p>
              <p className="reveal reveal-delay-3">
                By choosing materials that wear in rather than wear out, we ensure each item develops a unique character over time, becoming a cherished, personal companion.
              </p>
            </div>
          </div>
          <div className="scale-reveal overflow-hidden aspect-[4/5]">
            <img src={MATERIALS_IMAGE} alt="Close up of high quality wool overcoat" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 border-b border-[var(--border)] bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <p className="reveal text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-4">What We Stand For</p>
            <h2 className="reveal reveal-delay-1 font-display font-light tracking-tight text-[var(--ink)]"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              Our <em className="italic">pillars</em> of excellence.
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-[var(--border)]">
            {VALUES.map((v, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} py-10 grid md:grid-cols-12 gap-8 group`}>
                <p className="md:col-span-1 text-[10px] font-semibold text-[var(--ink-30)] tracking-widest self-start mt-1">{v.number}</p>
                <h3 className="md:col-span-4 font-display font-light text-xl text-[var(--ink)] leading-tight">{v.title}</h3>
                <p className="md:col-span-7 text-[13px] font-light leading-relaxed text-[var(--ink-60)] max-w-2xl">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRAFT IMAGE ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 bg-white border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="scale-reveal w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
            <img src={CRAFT_IMAGE} alt="Brand craftsmanship" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="px-6 md:px-10 lg:px-16 py-28 md:py-36 bg-[var(--ink)] text-white text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30 mb-8">The Journey Begins</p>
        <h2 className="reveal font-display font-light italic leading-tight text-white mb-12"
            style={{ fontSize: "clamp(32px, 5vw, 72px)" }}>
          Refined style is a choice.
        </h2>
        <Link
          to="/collection"
          className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white border-b border-white/40 pb-1 hover:border-white transition-colors"
        >
          Explore Collection →
        </Link>
      </section>

      <Newsletter />
      <OurPolicy />
    </div>
  );
}

export default About;
