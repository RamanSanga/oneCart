import React from "react";
import AboutImg from "../assets/About.png";
import About from "./About";


function Contact() {
  return (
    <section className="w-full bg-[#05060a] text-white">

      {/* ================= EDITORIAL HERO ================= */}
      <div className="min-h-[90vh] flex items-center px-6 md:px-20">
        <div className="max-w-6xl">
          <p className="text-xs tracking-[0.45em] uppercase text-white/40 mb-8">
            OneCart Support
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-light leading-[1.05] tracking-tight">
            Let’s talk.
          </h1>

          <p className="mt-10 max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
            From customer care to partnerships, our global support team is here
            to deliver a seamless OneCart experience — with the same attention
            to detail as our collections.
          </p>
        </div>
      </div>

      {/* ================= SPLIT EDITORIAL SECTION ================= */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* LEFT — IMAGE (FULL HEIGHT FEEL) */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[800px]">
          <img
            src={AboutImg}
            alt="OneCart Office"
            className="w-full h-full object-cover"
          />

          {/* SUBTLE OVERLAY TEXT */}
          <div className="absolute bottom-10 left-6 md:left-16">
            <p className="text-white text-xs tracking-[0.4em] uppercase">
              OneCart Headquarters
            </p>
          </div>
        </div>

        {/* RIGHT — CONTACT BLOCKS */}
          <div className="px-6 md:px-16 lg:px-24 py-20 lg:py-32 space-y-24 border-l border-white/10">

          {/* CUSTOMER CARE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-4">
              Customer Care
            </p>
            <p className="text-2xl md:text-3xl font-light text-white">
             ramansanga63@gmail.com
            </p>
            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              Our client care specialists are available Monday to Saturday,
              10:00 AM – 6:00 PM IST. We aim to respond within 24 hours.
            </p>
          </div>

          {/* BUSINESS */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-4">
              Business & Partnerships
            </p>
            <p className="text-2xl md:text-3xl font-light text-white">
              ramansanga63@gmail.com
            </p>
            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              For collaborations, wholesale, media, and strategic partnerships.
            </p>
          </div>

          {/* PHONE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-4">
              Phone
            </p>
            <p className="text-2xl md:text-3xl font-light text-white">
              +91 93065 32302
            </p>
            <p className="mt-4 text-white/60">
              Monday to Friday · 10 AM – 6 PM IST
            </p>
          </div>
        </div>
      </div>

      {/* ================= GLOBAL OFFICES ================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-32">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

          {/* MANUFACTURING */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-6">
              Manufacturing
            </p>
            <p className="text-lg font-light leading-relaxed text-white/70">
              OneCart Fashion Private Limited <br />
              Industrial Area, Model Town <br />
              Hisar, Haryana – 125001 <br />
              India
            </p>
          </div>

          {/* CORPORATE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-6">
              Corporate Office
            </p>
            <p className="text-lg font-light leading-relaxed text-white/70">
              OneCart Retail India Pvt. Ltd. <br />
              Tower A, Sector 18 <br />
              Hisar, Haryana – 122015 <br />
              India
            </p>
          </div>
        </div>
      </div>

      {/* ================= CLOSING EDITORIAL ================= */}
      <div className="border-t border-white/10 py-32 px-6 md:px-20">
        <p className="max-w-5xl text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-white/85">
          Thoughtfully designed support — crafted with the same precision,
          restraint, and care as every OneCart collection.
        </p>
      </div>
    </section>
  );
}

export default Contact;
