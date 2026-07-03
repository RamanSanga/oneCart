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
  );
}

export default OurPolicy;
