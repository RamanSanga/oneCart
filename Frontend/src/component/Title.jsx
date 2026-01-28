import React from "react";

function Title({ text1, text2 }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-light tracking-[0.25em] text-gray-900">
        {text1}{" "}
        <span className="font-medium text-black">{text2}</span>
      </h2>
    </div>
  );
}

export default Title;
