import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Hero({ heroData, heroCount, setHeroCount, totalSlides }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Auto-progress bar for the luxury slider
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (100 / 40); // 4000ms duration = 40 steps of 100ms
      });
    }, 100);
    return () => clearInterval(interval);
  }, [heroCount]);

  // Framer Motion Variants for Split Text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 },
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Helper to split text into animated words/letters
  const splitText = (text) => {
    if (!text) return null;
    return text.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
        {word.split("").map((char, charIndex) => (
          <motion.span key={charIndex} variants={letterVariants} className="inline-block origin-bottom">
            {char}
          </motion.span>
        ))}
      </span>
    ));
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end pb-28 md:pb-36 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl w-full mx-auto xl:mx-0">
        
        {/* Animated Text Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroCount}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[85px] font-light tracking-tight text-white leading-[1.05] mb-6 drop-shadow-xl" style={{ perspective: "1000px" }}>
              {splitText(heroData.text1 || "The New Standard")}
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg sm:text-xl md:text-2xl font-light text-white/90 tracking-wide mb-12 max-w-2xl drop-shadow-lg"
            >
              {heroData.text2 || "Discover our curated collection of luxury essentials."}
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              onClick={() => navigate("/collection")}
              className="group flex items-center gap-4 bg-white/10 backdrop-blur-md text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-2xl"
            >
              Explore Collection
              <FiArrowRight className="text-lg group-hover:translate-x-2 transition-transform duration-500" />
            </motion.button>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Luxury Slide Indicators */}
      <div className="absolute bottom-12 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
           <span className="text-white text-[10px] font-bold tracking-[0.2em]">0{heroCount + 1}</span>
           <div className="flex gap-2">
             {Array.from({ length: totalSlides }).map((_, i) => (
               <div 
                 key={i} 
                 onClick={() => setHeroCount(i)}
                 className="h-[1px] w-10 sm:w-16 bg-white/30 relative cursor-pointer overflow-hidden"
               >
                 {heroCount === i && (
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 0.1, ease: "linear" }}
                     className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_white]"
                   />
                 )}
               </div>
             ))}
           </div>
           <span className="text-white/50 text-[10px] font-bold tracking-[0.2em]">0{totalSlides}</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
