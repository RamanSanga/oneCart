import React from "react";

function Title({ text1, text2 }) {
  return (
     <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        <div className="h-[1px] w-12 bg-white/10 hidden sm:block" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] text-white text-center uppercase">
          {text1} <span className="font-semibold text-white/80">{text2}</span>
         </h2>
        <div className="h-[1px] w-12 bg-white/10 hidden sm:block" />
      </div>
      <div className="h-1.5 w-12 bg-yellow-300 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.45)]" />
    </div>
  );
}

export default Title;
