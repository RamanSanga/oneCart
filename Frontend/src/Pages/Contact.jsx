import React, { useState } from "react";
import OurPolicy from "../component/OurPolicy";

import heroWomen from "../assets/hero_women.jpg";

const SUPPORT_ITEMS = [
  { label: "Customer Care",          value: "contact@onecart.com",     note: "Monday–Saturday, 10 AM – 6 PM IST. Response within 24 hours." },
  { label: "Business & Partnerships", value: "business@onecart.com",   note: "Collaborations, wholesale, media, and strategic partnerships." },
  { label: "Phone",                  value: "+91 93065 32302",         note: "Monday–Friday · 10 AM – 6 PM IST" },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent]   = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    /* In production, wire to backend. For now just show confirmation. */
    setSent(true);
  };

  return (
    <div className="bg-[var(--cream)] text-[var(--ink)]" style={{ paddingTop: "var(--nav-height)" }}>

      {/* ── HERO HEADER ── */}
      <div className="px-6 md:px-10 lg:px-16 py-16 md:py-24 border-b border-[var(--border)] bg-[var(--cream)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)] mb-6">OneCart Support</p>
          <h1 className="font-display font-light leading-[1.05] tracking-tight text-[var(--ink)]"
              style={{ fontSize: "clamp(42px, 6vw, 88px)" }}>
            Get in touch.
          </h1>
          <p className="mt-8 text-[14px] font-light leading-relaxed text-[var(--ink-60)] max-w-[52ch]">
            Our team is here with the same level of care that goes into every piece we make — thoughtful, responsive, and always on your side.
          </p>
        </div>
      </div>

      {/* ── SPLIT: IMAGE + FORM ── */}
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-0 border-b border-[var(--border)]">
        {/* Image */}
        <div className="hidden lg:block h-[600px] overflow-hidden relative">
          <img src={heroWomen} alt="OneCart showroom" className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-[10px] font-semibold uppercase tracking-[0.25em]">OneCart / India</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 md:px-10 lg:px-16 py-16 lg:border-l border-[var(--border)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-10">Send a Message</p>

          {sent ? (
            <div className="py-20 text-center">
              <p className="font-display font-light italic text-[var(--ink)] mb-3"
                 style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
                Thank you.
              </p>
              <p className="text-[13px] font-light text-[var(--ink-60)] max-w-[40ch] mx-auto">
                We've received your message and will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 max-w-md">
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Name</label>
                <input
                  name="name" required value={form.name} onChange={handleChange}
                  placeholder="Your full name"
                  className="input-underline"
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Email</label>
                <input
                  name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className="input-underline"
                />
              </div>
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-2">Message</label>
                <textarea
                  name="message" required rows={5} value={form.message} onChange={handleChange}
                  placeholder="How can we help?"
                  className="input-underline resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── SUPPORT CHANNELS ── */}
      <div className="px-6 md:px-10 lg:px-16 py-16 md:py-20 bg-white border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-12">Direct Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
            {SUPPORT_ITEMS.map((item, i) => (
              <div key={i} className="pt-10 md:pt-0 md:pl-10 first:pl-0 first:pt-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-4">{item.label}</p>
                <p className="text-[15px] font-light text-[var(--ink)] mb-3 break-all">{item.value}</p>
                <p className="text-[12px] font-light text-[var(--ink-60)] leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ADDRESS ── */}
      <div className="px-6 md:px-10 lg:px-16 py-16 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-5">Manufacturing</p>
            <p className="text-[13px] font-light text-[var(--ink-60)] leading-loose">
              OneCart Fashion Private Limited<br />
              Industrial Area, Model Town<br />
              Hisar, Haryana — 125001<br />
              India
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-5">Corporate Office</p>
            <p className="text-[13px] font-light text-[var(--ink-60)] leading-loose">
              OneCart Retail India Pvt. Ltd.<br />
              Tower A, Sector 18<br />
              Hisar, Haryana — 125001<br />
              India
            </p>
          </div>
        </div>
      </div>

      <OurPolicy />
    </div>
  );
}

export default Contact;
