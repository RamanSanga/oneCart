import React, { useState, useEffect } from "react";
import Background from "../component/Background";
import HeroPremium from "../component/HeroPremium";
import InfiniteMarquee from "../component/InfiniteMarquee";
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
    <div className="relative w-full min-h-screen bg-transparent">

      {/* 100vh wrapper for Hero */}
      <div className="relative w-full min-h-svh pb-24 lg:pb-32">
        <Background heroCount={heroCount} />
        <HeroPremium
          heroData={heroData[heroCount]}
          heroCount={heroCount}
          totalSlides={heroData.length}
        />
      </div>

      <InfiniteMarquee />
      <Product />
      <Newletter />
      <OurPolicy />
    </div>
  );
}

export default Home;
