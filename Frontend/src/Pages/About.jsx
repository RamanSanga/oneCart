import React, { useEffect } from "react";
import AboutImg from "../assets/About.png";
import AboutImg2 from "../assets/About2.png"
import Newsletter from "../component/NewLetterBox";


function AboutUs() {

  /* =============================
     INTERSECTION OBSERVER
  ============================== */
  useEffect(() => {
    const items = document.querySelectorAll(".reveal, .image-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-white text-black overflow-hidden">

      {/* ================= HERO ================= */}
      <div className="min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-5xl text-center">

          <p className="reveal text-sm tracking-[0.35em] uppercase text-gray-500 mb-8">
            <span className="reveal-inner">About OneCart</span>
          </p>

          <h1 className="reveal text-4xl md:text-6xl font-light leading-tight">
            <span className="reveal-inner">
              Redefining modern fashion<br className="hidden md:block" />
              through quiet luxury
            </span>
          </h1>

          <p className="reveal mt-10 text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            <span className="reveal-inner">
              OneCart is built on the belief that true style is effortless.
              We design refined essentials for everyday life — timeless,
              intentional, and made to last.
            </span>
          </p>

        </div>
      </div>

      {/* ================= SECTION 1 ================= */}
      <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

        {/* IMAGE */}
        <div className="image-reveal w-full h-[460px]">
          {/* replace src later */}
          <img
            src={AboutImg}
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />

        </div>

        {/* TEXT */}
        <div>
          <p className="reveal text-sm tracking-[0.35em] uppercase text-gray-500 mb-6">
            <span className="reveal-inner">Our Philosophy</span>
          </p>

          <h2 className="reveal text-3xl md:text-4xl font-light mb-8">
            <span className="reveal-inner">
              Design that feels natural.
            </span>
          </h2>

          <p className="reveal text-gray-600 leading-relaxed text-base">
            <span className="reveal-inner">
              Every piece is designed with balance in mind — clean silhouettes,
              premium fabrics, and a neutral palette that transcends trends.
              We believe in clothing that integrates seamlessly into your life.
            </span>
          </p>
        </div>
      </div>

      {/* ================= STATEMENT ================= */}
      <div className="border-t border-b border-gray-200 py-28 px-6 text-center">
        <p className="reveal max-w-4xl mx-auto text-xl md:text-2xl font-light text-gray-800 leading-relaxed">
          <span className="reveal-inner">
            “Fashion fades. Style remains.
            We design for the moments that endure.”
          </span>
        </p>
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

        {/* TEXT */}
        <div>
          <p className="reveal text-sm tracking-[0.35em] uppercase text-gray-500 mb-6">
            <span className="reveal-inner">Our Craft</span>
          </p>

          <h2 className="reveal text-3xl md:text-4xl font-light mb-8">
            <span className="reveal-inner">
              Quality you can feel.
            </span>
          </h2>

          <p className="reveal text-gray-600 leading-relaxed text-base">
            <span className="reveal-inner">
              From sourcing to final construction, we collaborate with
              skilled manufacturers to ensure exceptional quality.
              Every detail is considered — durability, comfort, and finish.
            </span>
          </p>
        </div>

        {/* IMAGE */}
        <div className="image-reveal w-full h-[460px]">
          {/* replace src later */}
           <img
            src={AboutImg2}
            alt="Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ================= VALUES ================= */}
      <div className="bg-[#fafafa] py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 text-center">

          <div className="reveal">
            <span className="reveal-inner">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Minimalism
              </p>
              <p className="text-gray-600 leading-relaxed">
                Clean design that never tries too hard.
              </p>
            </span>
          </div>

          <div className="reveal">
            <span className="reveal-inner">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Precision
              </p>
              <p className="text-gray-600 leading-relaxed">
                Thoughtful construction and refined details.
              </p>
            </span>
          </div>

          <div className="reveal">
            <span className="reveal-inner">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                Longevity
              </p>
              <p className="text-gray-600 leading-relaxed">
                Designed beyond seasons and trends.
              </p>
            </span>
          </div>

        </div>
      </div>

      <div>
        <Newsletter/>
      </div>

      {/* ================= CLOSING ================= */}
      <div className="py-28 px-6 text-center">
        <h2 className="reveal text-3xl md:text-4xl font-light mb-8">
          <span className="reveal-inner">Welcome to OneCart.</span>
        </h2>

        <p className="reveal text-gray-600 max-w-xl mx-auto leading-relaxed">
          <span className="reveal-inner">
            A modern fashion destination for those who appreciate
            understated luxury and intentional design.
          </span>
        </p>
      </div>

    </section>
  );
}

export default AboutUs;
