import React from "react";
import ContactImg from "../assets/oneCart.png";

function Contact() {
  return (
    <section className="w-full bg-white text-black">

      {/* ================= EDITORIAL HERO ================= */}
      <div className="min-h-[90vh] flex items-center px-6 md:px-20">
        <div className="max-w-6xl">
          <p className="text-xs tracking-[0.45em] uppercase text-gray-500 mb-8">
            OneCart Support
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-light leading-[1.05] tracking-tight">
            Let’s talk.
          </h1>

          <p className="mt-10 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
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
            src={ContactImg}
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
        <div className="px-6 md:px-16 lg:px-24 py-20 lg:py-32 space-y-24">

          {/* CUSTOMER CARE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-4">
              Customer Care
            </p>
            <p className="text-2xl md:text-3xl font-light">
              support@onecart.com
            </p>
            <p className="mt-4 text-gray-600 max-w-md leading-relaxed">
              Our client care specialists are available Monday to Saturday,
              10:00 AM – 6:00 PM IST. We aim to respond within 24 hours.
            </p>
          </div>

          {/* BUSINESS */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-4">
              Business & Partnerships
            </p>
            <p className="text-2xl md:text-3xl font-light">
              business@onecart.com
            </p>
            <p className="mt-4 text-gray-600 max-w-md leading-relaxed">
              For collaborations, wholesale, media, and strategic partnerships.
            </p>
          </div>

          {/* PHONE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-4">
              Phone
            </p>
            <p className="text-2xl md:text-3xl font-light">
              +91 98765 43210
            </p>
            <p className="mt-4 text-gray-600">
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
            <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-6">
              Manufacturing
            </p>
            <p className="text-lg font-light leading-relaxed text-gray-800">
              OneCart Fashion Private Limited <br />
              Industrial Area, Model Town <br />
              Hisar, Haryana – 125001 <br />
              India
            </p>
          </div>

          {/* CORPORATE */}
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-6">
              Corporate Office
            </p>
            <p className="text-lg font-light leading-relaxed text-gray-800">
              OneCart Retail India Pvt. Ltd. <br />
              Tower A, Sector 18 <br />
              Gurugram, Haryana – 122015 <br />
              India
            </p>
          </div>
        </div>
      </div>

      {/* ================= CLOSING EDITORIAL ================= */}
      <div className="border-t border-gray-200 py-32 px-6 md:px-20">
        <p className="max-w-5xl text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight">
          Thoughtfully designed support — crafted with the same precision,
          restraint, and care as every OneCart collection.
        </p>
      </div>
    </section>
  );
}

export default Contact;
