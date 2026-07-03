import React, { useContext, useState, useEffect } from "react";
import { shopDataContext } from "../Context/ShopContext";
import Card from "./Card";

/**
 * Best sellers — 4 featured products in a row.
 */
function BestSeller() {
  const { products } = useContext(shopDataContext);
  const [best, setBest] = useState([]);

  useEffect(() => {
    const filtered = products.filter(p => p.bestSeller);
    setBest(filtered.slice(0, 4));
  }, [products]);

  if (!best.length) return null;

  return (
    <section className="py-20 md:py-28 px-6 md:px-10 lg:px-16 bg-white border-t border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">Customer Favourites</p>
            <h2 className="font-display font-light tracking-tight text-[var(--ink)] leading-tight"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {best.map(item => (
            <Card
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image1}
              hoverImage={item.image2}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
