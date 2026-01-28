import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/shopContext";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

function Card({ name, image, id, price }) {
  const { currency, products } = useContext(shopDataContext);
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);

  // ---------------- WISHLIST (LOCAL ONLY) ----------------
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  const toggleWishlist = (e) => {
    e.stopPropagation(); // prevent card click
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((pid) => pid !== id);
      setIsWishlisted(false);
    } else {
      wishlist.push(id);
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  // ---------------- STOCK LOGIC (SAFE) ----------------
  const product = products?.find((p) => p._id === id);

  let stock = null;
  if (product) {
    if (typeof product.stock === "number") {
      stock = product.stock;
    } else if (product.stock && typeof product.stock === "object") {
      const plain = product.stock.toObject
        ? product.stock.toObject()
        : { ...product.stock };
      const values = Object.values(plain).map((v) => Number(v) || 0);
      stock = values.reduce((a, b) => a + b, 0);
    }
  }

  const lowStock = typeof stock === "number" && stock > 0 && stock <= 3;
  const outOfStock = typeof stock === "number" && stock <= 0;

  return (
    <div
      className="group cursor-pointer relative"
      onClick={() => navigate(`/productdetail/${id}`)}
    >
      {/* WISHLIST HEART */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur p-2 rounded-full hover:scale-110 transition"
      >
        <Heart
          size={16}
          className={`${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-700"
          }`}
        />
      </button>

      {/* LOW STOCK BADGE */}
      {lowStock && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-100 text-yellow-900 px-2 py-1 text-xs rounded">
          Hurry — {stock} left
        </div>
      )}

      {/* OUT OF STOCK OVERLAY */}
      {outOfStock && (
        <div className="absolute inset-0 z-20 bg-white/80 flex items-center justify-center text-red-600 font-medium text-sm">
          Out of stock
        </div>
      )}

      {/* IMAGE */}
      <div className="overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-[220px] sm:h-[250px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* TEXT */}
      <div className="mt-4 text-center">
        <p className="text-sm font-light tracking-wide text-gray-800">
          {name}
        </p>
        <p className="text-sm mt-1 text-gray-900">
          {currency} {price}
        </p>
      </div>
    </div>
  );
}

export default Card;



// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Card({ id, name, image, hoverImage, price, isBestSeller }) {
//   const navigate = useNavigate();

//   return (
//     <div className="group">
//       {/* IMAGE WRAPPER – FIXED SIZE */}
//       <div
//         onClick={() => navigate(`/product/${id}`)}
//         className="relative bg-[#f6f6f6] w-full h-[420px] flex items-center justify-center overflow-hidden cursor-pointer"
//       >
//         {/* BADGE */}
//         {isBestSeller && (
//           <span className="absolute top-4 left-4 text-[11px] tracking-widest bg-black text-white px-3 py-1 z-10">
//             BEST SELLER
//           </span>
//         )}

//         {/* MAIN IMAGE */}
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-full object-contain p-10 transition-opacity duration-300 group-hover:opacity-0"
//         />

//         {/* HOVER IMAGE */}
//         {hoverImage && (
//           <img
//             src={hoverImage}
//             alt=""
//             className="absolute inset-0 w-full h-full object-contain p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//           />
//         )}

//         {/* HOVER ACTION BAR */}
//         <div className="absolute bottom-0 left-0 right-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//           <button className="flex-1 bg-black text-white py-3 text-sm">
//             Add to cart
//           </button>
//           <button className="flex-1 bg-[#c9b28b] text-black py-3 text-sm">
//             Quick shop
//           </button>
//         </div>
//       </div>

//       {/* TEXT */}
//       <div className="mt-4 text-center">
//         <p className="text-sm tracking-wide text-gray-900">{name}</p>
//         <p className="text-sm mt-1 font-medium">₹ {price}</p>
//       </div>
//     </div>
//   );
// }

// export default Card;
