import React from "react";
import { Link, useNavigate } from "react-router-dom";

const FOOTER_LINKS = {
  Collections: [
    { label: "All Products", path: "/collection" },
    { label: "Men",          path: "/collection?category=Men" },
    { label: "Women",        path: "/collection?category=Women" },
    { label: "Kids",         path: "/collection?category=Kids" },
  ],
  Support: [
    { label: "My Orders",   path: "/order" },
    { label: "Returns",     path: "/contact" },
    { label: "Size Guide",  path: "/contact" },
    { label: "Contact Us",  path: "/contact" },
  ],
  Company: [
    { label: "About",    path: "/about" },
    { label: "Contact",  path: "/contact" },
    { label: "Careers",  path: "/about" },
  ],
};

function OurPolicy() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── FOOTER STORY BANNER ── */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-[#EEECEA] border-t border-[var(--border)]">
        <img 
          src="https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1000&auto=format&fit=crop" 
          alt="Campaign Lookbook" 
          className="w-full h-full object-cover object-center filter brightness-[0.85]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/20 flex flex-col items-center justify-center text-center p-6">
          <p className="text-white text-[9px] font-semibold uppercase tracking-[0.4em] mb-4">The Anthology</p>
          <h3 className="text-white font-display font-light italic leading-tight mb-8" style={{ fontSize: "clamp(24px, 4vw, 48px)" }}>
            Worn with intention.
          </h3>
          <Link
            to="/collection"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white border-b border-white/50 pb-1 hover:border-white transition-all duration-300"
          >
            Explore the Campaign
          </Link>
        </div>
      </div>

      <footer className="bg-[var(--cream)] border-t border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <button
              onClick={() => navigate("/")}
              className="text-[15px] font-semibold tracking-[0.12em] uppercase font-body text-[var(--ink)]"
            >
              OneCart
            </button>
            <p className="text-[12px] font-light leading-relaxed text-[var(--ink-60)] max-w-[30ch]">
              Curated fashion for the considered wardrobe. Quality over quantity, always.
            </p>
            <div className="text-[11px] font-light text-[var(--ink-40)] leading-relaxed space-y-1">
              <p>OneCart Fashion Pvt. Ltd.</p>
              <p>Industrial Area, Hisar</p>
              <p>Haryana — 125001, India</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)]">{group}</p>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-[12px] font-light text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-6 text-[11px] font-light text-[var(--ink-60)]">
            <a href="tel:+919306532302" className="hover:text-[var(--ink)] transition-colors">+91 93065 32302</a>
            <a href="mailto:contact@onecart.com" className="hover:text-[var(--ink)] transition-colors">contact@onecart.com</a>
          </div>
          <div className="flex flex-wrap gap-5 text-[11px] font-light text-[var(--ink-40)]">
            <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[var(--ink)] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[10px] text-[var(--ink-30)] uppercase tracking-widest">
            © {new Date().getFullYear()} OneCart. All rights reserved.
          </p>
          <p className="text-[10px] text-[var(--ink-30)] uppercase tracking-widest">India · English · INR</p>
        </div>
      </div>
      </footer>
    </>
  );
}

export default OurPolicy;
