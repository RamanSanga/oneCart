import React from "react";
import LatestCollection from "../component/LatestCollection.jsx";
import BestSeller from "../component/BestSeller.jsx";

function Product() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <LatestCollection />
      <BestSeller />
    </div>
  );
}

export default Product;
