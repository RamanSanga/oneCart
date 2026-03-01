import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { shopDataContext } from "../Context/ShopContext";
import { authDataContext } from "../Context/AuthContext";
import RelatedProduct from "../component/relatedProduct";
import { Heart } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const { products, currency, addToCart, wishlistItems, getWishlist } =
    useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (!products.length) return;
    const item = products.find((p) => p._id === id);
    if (!item) return;

    setProductData(item);
    setImage(item.image1 || "");
  }, [id, products]);

  /* ================= DEFAULT SIZE ================= */
  useEffect(() => {
    if (!productData) return;
    if (!size && productData.sizes?.length) {
      setSize(productData.sizes[0]);
    }
  }, [productData]);

  /* ================= SYNC WISHLIST ================= */
  useEffect(() => {
    if (!productData) return;
    const exists = wishlistItems.some(
      (item) => item._id === productData._id
    );
    setIsWishlisted(exists);
  }, [wishlistItems, productData]);

  /* ================= TOGGLE WISHLIST ================= */
  const toggleWishlist = async () => {
    if (!productData) return;

    try {
      if (isWishlisted) {
        await axios.post(
          `${serverUrl}/api/wishlist/remove`,
          { productId: productData._id },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${serverUrl}/api/wishlist/add`,
          { productId: productData._id },
          { withCredentials: true }
        );
      }

      await getWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  if (!productData) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  return (
    <section className="pt-28 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="relative bg-gray-100 rounded-lg">
          <img
            src={image}
            alt={productData.name}
            className="w-full h-[500px] object-cover"
          />

          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 bg-white p-2 rounded-full"
          >
            <Heart
              size={18}
              className={
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }
            />
          </button>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <h1 className="text-3xl font-light">
            {productData.name}
          </h1>

          <p className="text-xl font-medium">
            {currency} {productData.price}
          </p>

          {productData.sizes?.length > 0 && (
            <div className="flex gap-3">
              {productData.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 border ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => addToCart(productData._id, size)}
            className="w-full py-4 border border-black uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        currentId={productData._id}
      />
    </section>
  );
}

export default ProductDetail;
