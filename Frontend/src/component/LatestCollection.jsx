import React, { useContext, useState, useEffect } from "react";
import { shopDataContext } from "../Context/ShopContext";
import Card from "./Card";
import Skeleton from "./Skeleton";

/**
 * Latest arrivals — 4-column grid, clean editorial section header.
 */
function LatestCollection() {
  const { products, productsLoading } = useContext(shopDataContext);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    setLatest(products.slice(0, 8));
  }, [products]);

  return (
    <section className="py-20 md:py-28 px-6 md:px-10 lg:px-16 bg-[var(--cream)]">
      <div className="max-w-[1440px] mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">Just In</p>
            <h2 className="font-display font-light tracking-tight text-[var(--ink)] leading-tight"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              New Arrivals
            </h2>
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} type="card" />)
            : latest.map(item => (
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

export default LatestCollection;
