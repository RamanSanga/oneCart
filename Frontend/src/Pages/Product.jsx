import React from "react";
import LatestCollection from "../component/LatestCollection.jsx";
import BestSeller from "../component/BestSeller.jsx";
import PromoSection from "../component/PromoSection.jsx";

function Product() {
  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-12 text-white  min-h-screen">
      <PromoSection />
      <LatestCollection />
      <BestSeller />
    </div>
  );
}

export default Product;
