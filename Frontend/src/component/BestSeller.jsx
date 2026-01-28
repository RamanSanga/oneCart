import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { shopDataContext } from "../Context/shopContext";
import Card from "./Card";

function BestSeller() {
  const { products } = useContext(shopDataContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const filterProduct = products.filter((item) => item.bestSeller);
    setBestSeller(filterProduct.slice(0, 4));
  }, [products]);

  return (
    <section className="py-24 border-t border-gray-200">
      <Title text1="BEST" text2="SELLERS" />

      <p className="text-gray-500 text-sm text-center max-w-xl mx-auto mt-4">
        Our most loved styles chosen by customers worldwide.
      </p>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-14">
        {bestSeller.map((item) => (
          <Card
            key={item._id}         
            id={item._id}
            name={item.name}
            image={item.image1}
            hoverImage={item.image2}
            price={item.price}
            isBestSeller={item.bestSeller}
          />
        ))}
      </div>
    </section>
  );
}

export default BestSeller;
