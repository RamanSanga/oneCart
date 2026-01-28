import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { shopDataContext } from "../Context/shopContext";
import Card from "./Card";

function LatestCollection() {
  const { products } = useContext(shopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(3,11));
  }, [products]);

  return (
    <section className="py-20">
      <Title text1="LATEST" text2="COLLECTIONS" />

      <p className="text-gray-500 text-sm text-center max-w-xl mx-auto mt-4">
        Discover the newest arrivals crafted with premium fabrics and timeless design.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
        {latestProducts.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image1}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
}

export default LatestCollection;
