import React from "react";
import back1 from "../assets/back1.png";
import back2 from "../assets/back2.png";
import back3 from "../assets/back3.png";
import back4 from "../assets/back4.png";
import back5 from "../assets/back5.png";
import back6 from "../assets/back6.png";
import back7 from "../assets/back7.png";
import back8 from "../assets/back8.png";
import back9 from "../assets/back9.png";


function Background({ heroCount }) {
  const images = [back9, back2, back7, back6];

  return (
    <div className="w-full h-[90vh] relative overflow-hidden">
      <img
        src={images[heroCount % images.length]}
        alt="hero background"
        className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
}

export default Background;
