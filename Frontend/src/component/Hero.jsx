import React from "react";
import { FaCircle } from "react-icons/fa";

function Hero({ heroData, heroCount, setHeroCount, totalSlides }) {
  return (
    <div className="
      absolute top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2 
      text-center text-white z-20
    ">
      
      <p className="text-5xl font-light">{heroData.text1}</p>
      <p className="mt-3 text-xl font-light opacity-90">{heroData.text2}</p>

      {/* Dots – AUTO BASED ON IMAGE COUNT */}
      <div className="flex justify-center gap-3 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <FaCircle
            key={i}
            className={`cursor-pointer transition-all ${
              heroCount === i ? "text-white" : "text-white/40"
            }`}
            onClick={() => setHeroCount(i)}
          />
        ))}
      </div>

    </div>
  );
}

export default Hero;
