import React, { useState, useEffect } from "react";
import Background from "../component/Background";
import Hero from "../component/Hero";
import Product from "./Product.jsx"
import OurPolicy from "../component/OurPolicy.jsx"
import Newletter from "../component/NewLetterBox.jsx";
function Home() {
  const heroData = [
    { text1: "Premium Quality", text2: "Designed For Modern Lifestyle" },
    { text1: "New Arrivals", text2: "Explore The Latest Trends" },
    { text1: "Premium Quality", text2: "Designed For Modern Lifestyle" },
    { text1: "", text2: "" },
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prev) =>
        prev === heroData.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[90vh]">

      <Background heroCount={heroCount} />

      <Hero
        heroData={heroData[heroCount]}
        heroCount={heroCount}
        setHeroCount={setHeroCount}
        totalSlides={heroData.length}  // IMPORTANT
      />
      <Product />
      <Newletter />
      <OurPolicy />
    </div>
  );
}

export default Home;
