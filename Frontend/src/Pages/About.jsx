import React, { useEffect, useRef } from "react";
import { FiArrowUpRight, FiGlobe, FiTarget, FiHeart, FiAward, FiShield } from "react-icons/fi";
import Newsletter from "../component/NewLetterBox";
import { Link } from "react-router-dom";

// Import generated images (or placeholders if preferred)
// Note: In a real project, these would be local assets or Cloudinary URLs
const HERO_IMAGE = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";
const DETAIL_IMAGE = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop";
const CRAFT_IMAGE = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop";

function About() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#05060a] text-white overflow-x-hidden pt-20">
      {/* CUSTOM ANIMATION STYLES */}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.2s; }
        .reveal-delay-2 { transition-delay: 0.4s; }
        .reveal-delay-3 { transition-delay: 0.6s; }
        
        .scale-reveal {
          opacity: 0;
          transform: scale(1.05);
          transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scale-reveal.is-visible {
          opacity: 1;
          transform: scale(1);
        }

        .line-reveal {
          position: relative;
          overflow: hidden;
        }
          .line-reveal::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
            background: #05060a;
          transition: transform 1.2s cubic-bezier(0.83, 0, 0.17, 1);
          transform: translateX(0);
        }
        .line-reveal.is-visible::after {
          transform: translateX(101%);
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-16 lg:px-24">
        <div className="z-10 max-w-5xl">
          <p className="reveal text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">
            Established 2024 — OneCart Anthology
          </p>
          <h1 className="reveal reveal-delay-1 text-5xl md:text-8xl font-light tracking-tight leading-[1.1] mb-12">
            The art of <span className="italic font-serif">intentional</span> <br className="hidden md:block" /> living and style.
          </h1>
          <div className="reveal reveal-delay-2 flex flex-wrap gap-8 items-center">
            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              We create timeless essentials designed to transcend seasons and
              celebrate the beauty of minimalist craftsmanship.
            </p>
            <div className="h-px w-24 bg-white/10 hidden sm:block"></div>
            <button className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-white/60 transition-colors">
              Discover Our Story
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <FiArrowUpRight size={18} />
              </div>
            </button>
          </div>
        </div>

        {/* ASYMMETRICAL BACKGROUND ELEMENTS */}
        <div className="absolute top-20 right-[-10%] w-[50%] aspect-square scale-reveal">
          <img src={HERO_IMAGE} alt="Luxury Fashion" className="w-full h-full object-cover rounded-[60px] opacity-20 mix-blend-screen" />
        </div>
      </section>

      {/* MARQUEE TEXT */}
      <div className="py-10 border-y border-white/10 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex gap-20">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl md:text-6xl font-light italic text-white/12">Timeless Craft</span>
              <span className="h-2 w-2 rounded-full bg-white/10"></span>
              <span className="text-4xl md:text-6xl font-light text-white/12">Ethical Sourcing</span>
              <span className="h-2 w-2 rounded-full bg-white/10"></span>
              <span className="text-4xl md:text-6xl font-light italic text-white/12">Modern Minimal</span>
              <span className="h-2 w-2 rounded-full bg-white/10"></span>
              <span className="text-4xl md:text-6xl font-light text-white/12">Quiet Luxury</span>
              <span className="h-2 w-2 rounded-full bg-white/10"></span>
            </div>
          ))}
        </div>
      </div>

      {/* STORY SECTION - ASYMMETRICAL EDITORIAL */}
      <section className="py-32 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <div className="scale-reveal relative z-10 rounded-[40px] overflow-hidden aspect-4/5 shadow-2xl border border-white/10">
              <img src={DETAIL_IMAGE} alt="Detail" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square bg-white/5 rounded-[40px] -z-10 reveal"></div>
          </div>
          <div className="lg:col-span-6 lg:ml-auto">
            <div className="max-w-xl">
              <p className="reveal text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-300 mb-6">Our Philosophy</p>
              <h2 className="reveal reveal-delay-1 text-4xl md:text-6xl font-light leading-tight mb-8">
                Where every <span className="italic">thread</span> <br className="hidden md:block" /> tells a story.
              </h2>
              <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                <p className="reveal reveal-delay-2">
                  OneCart was born from a simple realization: the world has too much noise, and not enough silence. We set out to create a sanctuary of style where quality takes precedence over quantity.
                </p>
                <p className="reveal reveal-delay-3">
                  Our pieces are not just products; they are investment in craftsmanship. We work with artisans who have spent decades perfecting their trade, ensuring that every stitch meets our exacting standards of excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES - PREMIUM DARK CARDS */}
      <section className="bg-[#0a0b0f] py-32 px-6 md:px-16 lg:px-24 rounded-[60px] mx-4 md:mx-10 my-20 border border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
            <div className="max-w-2xl">
              <p className="reveal text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-300 mb-6">The Foundations</p>
              <h2 className="reveal reveal-delay-1 text-4xl md:text-6xl font-light text-white leading-tight">
                Our pillars of <span className="text-yellow-300 italic">excellence</span>.
              </h2>
            </div>
            <p className="reveal reveal-delay-2 text-white/50 max-w-sm mb-4">
              We operate at the intersection of traditional heritage and future-facing innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiGlobe />, title: "Ethical Sourcing", desc: "We partner exclusively with certified suppliers who prioritize fair labor and sustainable environmental practices." },
              { icon: <FiTarget />, title: "Precision Design", desc: "Every silhouette is prototyped and refined for months to achieve the perfect balance of form and function." },
              { icon: <FiAward />, title: "Lasting Quality", desc: "We use premium long-staple fibers and superior tanning processes to ensure our pieces age beautifully over time." }
            ].map((value, idx) => (
              <div key={idx} className={`reveal reveal-delay-${idx + 1} group bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[40px] hover:bg-white/10 transition-all duration-700`}>
                <div className="w-16 h-16 rounded-2xl bg-yellow-300/15 text-yellow-300 flex items-center justify-center text-2xl mb-8 group-hover:bg-yellow-300 group-hover:text-black transition-all">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-medium text-white mb-6 transition-colors">{value.title}</h3>
                <p className="text-white/55 leading-relaxed transition-colors">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Founded In", value: "2024" },
            { label: "Artisan Partners", value: "48+" },
            { label: "Global Reach", value: "120+" },
            { label: "Quality Rating", value: "99%" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center reveal">
              <p className="text-white/40 uppercase tracking-widest text-[10px] mb-4">{stat.label}</p>
              <p className="text-5xl md:text-7xl font-light tracking-tighter italic">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US - EDITORIAL GRID */}
      <section className="py-32 px-6 md:px-16 lg:px-24 bg-[#05060a]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="reveal text-4xl md:text-6xl font-light leading-tight mb-12">
              Why the world <br /> chooses <span className="font-serif italic text-yellow-300">OneCart</span>.
            </h2>
            <div className="space-y-12">
              {[
                { icon: <FiHeart />, title: "Human-Centric Approach", desc: "We design for real bodies and real lives, prioritizing comfort without ever compromising on aesthetic elegance." },
                { icon: <FiShield />, title: "Secure & Transparent", desc: "From encrypted payments to clear supply chain tracking, we believe transparency is the ultimate luxury." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 reveal">
                  <div className="shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl text-white/70">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-4 uppercase tracking-widest text-white">{item.title}</h3>
                    <p className="text-white/55 leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="scale-reveal rounded-[60px] overflow-hidden aspect-square border border-white/10">
              <img src={CRAFT_IMAGE} alt="Craftsmanship" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="py-20">
        <Newsletter />
      </div>

      {/* FINAL CTA - CINEMATIC */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#05060a] -z-10">
          {/* Cinematic background texture or gradient */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-black/80"></div>
        </div>

        <div className="max-w-4xl z-10">
          <p className="reveal text-yellow-300 uppercase tracking-[0.5em] text-[10px] mb-10">The Journey Begins</p>
          <h2 className="reveal reveal-delay-1 text-5xl md:text-8xl font-light text-white tracking-tighter leading-tight mb-16">
            Refined style <br /> is a <span className="italic font-serif text-yellow-300">choice</span>.
          </h2>
          <button className="reveal reveal-delay-2 group relative px-12 py-6 rounded-full bg-white text-black font-bold uppercase tracking-[0.25em] text-xs hover:bg-yellow-300 transition-all duration-500 overflow-hidden shadow-2xl">
            <span className="relative z-10">
              <Link to="/collection" className="flex items-center gap-3">
                Explore Collection
              </Link>
            </span>
            <div className="absolute inset-0 bg-yellow-300 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;
