import React, { useState, useContext } from "react";
import axios from "axios";
import uploadIcon from "../assets/upload.png";
import { authDataContext } from "../context/AuthContext.jsx";
import {
  FiUploadCloud,
  FiImage,
  FiCheckSquare,
  FiBox,
} from "react-icons/fi";

function Add() {
  const { serverUrl } = useContext(authDataContext);

  const defaultSizes = ["S", "M", "L", "XL", "XXL"];

  const [images, setImages] = useState([null, null, null, null]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [price, setPrice] = useState("");

  const [sizes, setSizes] = useState([]);
  const [stockPerSize, setStockPerSize] = useState(
    Object.fromEntries(defaultSizes.map((s) => [s, 0]))
  );

  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSize = (size) => {
    setSizes((prev) => {
      const isSelected = prev.includes(size);
      if (isSelected) {
        setStockPerSize((p) => ({ ...p, [size]: 0 }));
        return prev.filter((s) => s !== size);
      }
      return [...prev, size];
    });
  };

  const handleStockChange = (size, value) => {
    const safeValue = Math.max(0, Number(value || 0));
    setStockPerSize((prev) => ({ ...prev, [size]: safeValue }));
  };

  const handleImageChange = (index, file) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!images[0]) return alert("At least 1 product image is required");
    if (!name.trim()) return alert("Product name is required");
    if (!price || price <= 0) return alert("Enter valid price");
    if (sizes.length === 0) return alert("Select at least one size");

    const hasStock = sizes.some((s) => stockPerSize[s] > 0);
    if (!hasStock) return alert("Add stock for at least one selected size");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      const filteredStock = {};
      sizes.forEach((s) => (filteredStock[s] = stockPerSize[s]));
      formData.append("stock", JSON.stringify(filteredStock));

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      await axios.post(`${serverUrl}/api/product/addproduct`, formData, {
        withCredentials: true,
      });

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Men");
      setSubCategory("TopWear");
      setBestSeller(false);
      setSizes([]);
      setImages([null, null, null, null]);
      setStockPerSize(Object.fromEntries(defaultSizes.map((s) => [s, 0])));

      alert("✅ Product added successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Add product failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f7f3]">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10">
        {/* HEADER */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gray-500 mb-2">
            Product Management
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.03em] uppercase">
            Add Product
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl">
            Create a premium catalog entry with product images, pricing, size
            availability, and inventory settings.
          </p>
        </section>

        <form
          onSubmit={handleAddProduct}
          className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-[0_10px_35px_rgba(0,0,0,0.035)] space-y-8 sm:space-y-10 lg:space-y-12"
        >
          {/* IMAGES */}
          <section>
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center">
                <FiImage className="text-lg" />
              </div>
              <div>
                <p className="text-xs tracking-[0.28em] uppercase text-gray-500">
                  Product Images
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload up to 4 images (minimum 1 required)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {images.map((img, i) => (
                <label
                  key={i}
                  className="group aspect-[3/4] rounded-3xl border border-black/10 bg-[#fafaf8] flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition-all duration-300"
                >
                  {img ? (
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      alt={`Product ${i + 1}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <img src={uploadIcon} className="w-10 opacity-40 mb-3" alt="" />
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        Upload
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(i, e.target.files[0])}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* NAME + DESCRIPTION */}
          <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8">
            <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5 sm:p-6">
              <p className="text-xs tracking-[0.28em] uppercase text-gray-500 mb-4">
                Product Name
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Premium Cotton T-Shirt"
                className="w-full text-xl sm:text-2xl lg:text-3xl font-light bg-transparent outline-none placeholder:text-gray-300"
              />
            </div>

            <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5 sm:p-6">
              <p className="text-xs tracking-[0.28em] uppercase text-gray-500 mb-4">
                Description
              </p>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fabric, fit, wash care, styling, etc."
                className="w-full bg-transparent text-sm sm:text-base outline-none resize-none placeholder:text-gray-400"
              />
            </div>
          </section>

          {/* META */}
          <section>
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center">
                <FiBox className="text-lg" />
              </div>
              <p className="text-xs tracking-[0.28em] uppercase text-gray-500">
                Product Details
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-3">
                  Category
                </p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm sm:text-base"
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
              </div>

              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-3">
                  Sub Category
                </p>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm sm:text-base"
                >
                  <option>TopWear</option>
                  <option>BottomWear</option>
                  <option>WinterWear</option>
                </select>
              </div>

              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-3">
                  Price
                </p>
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-transparent outline-none text-lg sm:text-xl font-medium"
                  placeholder="₹ 999"
                />
              </div>

              <div className="rounded-3xl border border-black/5 bg-[#fafaf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500">
                      Bestseller
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Feature product</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBestSeller(!bestSeller)}
                    className={`w-14 h-8 rounded-full transition relative ${
                      bestSeller ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                        bestSeller ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SIZES + STOCK */}
          <section className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8">
            <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#f7f7f3] border border-black/5 flex items-center justify-center">
                  <FiCheckSquare className="text-lg" />
                </div>
                <p className="text-xs tracking-[0.28em] uppercase text-gray-500">
                  Available Sizes
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                {defaultSizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-6 sm:px-7 py-3 text-xs tracking-[0.2em] rounded-full transition-all duration-300 ${
                      sizes.includes(size)
                        ? "bg-black text-white"
                        : "border border-black/10 bg-[#fafaf8] hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
              <p className="text-xs tracking-[0.28em] uppercase text-gray-500 mb-5">
                Stock Per Size
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultSizes.map((s) => {
                  const active = sizes.includes(s);

                  return (
                    <div
                      key={s}
                      className={`rounded-2xl border p-4 transition ${
                        active
                          ? "border-black/10 bg-[#fafaf8]"
                          : "border-black/5 bg-gray-50 opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-sm font-medium">{s}</span>
                        <span
                          className={`text-[10px] uppercase tracking-[0.18em] ${
                            active ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {active ? "Active" : "Disabled"}
                        </span>
                      </div>

                      <input
                        type="number"
                        min={0}
                        disabled={!active}
                        value={stockPerSize[s]}
                        onChange={(e) => handleStockChange(s, e.target.value)}
                        className="w-full bg-transparent outline-none text-lg disabled:cursor-not-allowed"
                        placeholder="0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <section className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Ensure at least one image, valid price, and stock for selected sizes.
            </div>

            <button
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-black text-white px-8 sm:px-10 lg:px-12 py-4 text-xs sm:text-sm tracking-[0.2em] uppercase hover:bg-neutral-800 transition disabled:opacity-50"
            >
              <FiUploadCloud className="text-base" />
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default Add;
