import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { shopDataContext } from "../Context/ShopContext";
import Card from "./Card";
import { CardSkeleton } from "./Skeleton";
import { motion } from "framer-motion";

function LatestCollection() {
  const { products, productsLoading } = useContext(shopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 8));
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="text-white/80 drop-shadow-md text-sm text-center max-w-xl mx-auto mt-6 leading-relaxed px-6">
          Discover the newest arrivals crafted with premium fabrics and timeless design.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 px-6"
      >
        {productsLoading
          ? Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)
          : latestProducts.map((item) => (
              <motion.div key={item._id} variants={itemVariants}>
                <Card
                  id={item._id}
                  name={item.name}
                  image={item.image1}
                  price={item.price}
                />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}

export default LatestCollection;
