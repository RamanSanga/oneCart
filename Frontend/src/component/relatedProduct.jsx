import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/shopContext";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

function RelatedProduct({ currentId }) {
  const { products } = useContext(shopDataContext);
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!products?.length) return;

    const filtered = products
      .filter(item => item._id !== currentId)
      .slice(0, 6); // 2 rows × 3 products

    setRelated(filtered);
  }, [products, currentId]);

  if (!related.length) return null;

  return (
    <section className="w-full bg-white mt-18">

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="border-t border-gray-200 mb-20" />
      </div>

      {/* TITLE */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <p className="text-sm tracking-[0.35em] uppercase text-gray-500">
          You may also like
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-24">
          {related.map(item => (
            <div
              key={item._id}
              className="group transition-transform duration-500 hover:-translate-y-2"
            >
              <Card
                id={item._id}
                name={item.name}
                image={item.image1}
                hoverImage={item.image2}
                price={item.price}
                isBestSeller={item.bestSeller}
              />
            </div>
          ))}
        </div>
      </div>

      {/* EXPLORE ALL PRODUCTS */}
      <div className="mt-28 pb-32 flex justify-center">
        <button
          onClick={() => navigate("/collection")}
          className="
            px-14 py-4
            border border-black
            text-sm uppercase tracking-widest
            hover:bg-black hover:text-white
            transition-all duration-300
          "
        >
          Explore all products
        </button>
      </div>

    </section>
  );
}

export default RelatedProduct;
