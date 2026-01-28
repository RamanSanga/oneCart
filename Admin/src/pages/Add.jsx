import React, { useState, useContext } from "react";
import axios from "axios";
import Nav from "../component/Nav.jsx";
import SideBar from "../component/SideBar.jsx";
import uploadIcon from "../assets/upload.png";
import { authDataContext } from "../context/AuthContext.jsx";

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

  // ================= HANDLERS =================

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

  // ================= SUBMIT =================

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

      // RESET
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

  // ================= UI =================

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Nav />
      <SideBar />

      <div className="ml-[80px] pt-[90px] px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-xl sm:text-2xl font-light tracking-[0.35em]">
            ADD PRODUCT
          </h1>
          <div className="w-20 h-[2px] bg-black mt-4" />
        </div>

        <form
          onSubmit={handleAddProduct}
          className="bg-white rounded-3xl shadow-sm border p-6 sm:p-10 lg:p-14 space-y-16"
        >
          {/* ================= IMAGES ================= */}
          <section>
            <p className="text-xs tracking-[0.3em] font-medium mb-6">
              PRODUCT IMAGES
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {images.map((img, i) => (
                <label
                  key={i}
                  className="aspect-[3/4] bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition"
                >
                  <img
                    src={img ? URL.createObjectURL(img) : uploadIcon}
                    className={`${
                      img
                        ? "w-full h-full object-cover"
                        : "w-10 opacity-40"
                    }`}
                    alt=""
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(i, e.target.files[0])
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          {/* ================= PRODUCT NAME ================= */}
          <section>
            <p className="text-xs tracking-[0.3em] font-medium mb-4">
              PRODUCT NAME
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Premium Cotton T-Shirt"
              className="w-full text-2xl sm:text-3xl font-light bg-transparent outline-none placeholder:text-gray-300"
            />
            <div className="w-28 h-[2px] bg-black mt-4" />
          </section>

          {/* ================= DESCRIPTION ================= */}
          <section>
            <p className="text-xs tracking-[0.3em] font-medium mb-4">
              DESCRIPTION
            </p>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric, fit, wash care, styling, etc."
              className="w-full bg-gray-50 rounded-2xl p-5 text-sm border border-gray-200 focus:border-black outline-none"
            />
          </section>

          {/* ================= META GRID ================= */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] mb-2">
                CATEGORY
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-b border-black bg-transparent py-3 outline-none"
              >
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
              </select>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.3em] mb-2">
                SUB CATEGORY
              </p>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border-b border-black bg-transparent py-3 outline-none"
              >
                <option>TopWear</option>
                <option>BottomWear</option>
                <option>WinterWear</option>
              </select>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.3em] mb-2">
                PRICE
              </p>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-b border-black bg-transparent py-3 outline-none text-lg"
                placeholder="₹"
              />
            </div>

            {/* ================= STOCK ================= */}
            <div>
              <p className="text-[10px] tracking-[0.3em] mb-2">
                STOCK PER SIZE
              </p>
              <div className="space-y-2">
                {defaultSizes.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span
                        className={`w-8 text-sm ${
                          active ? "font-medium" : "opacity-30"
                        }`}
                      >
                        {s}
                      </span>
                      <input
                        type="number"
                        min={0}
                        disabled={!active}
                        value={stockPerSize[s]}
                        onChange={(e) =>
                          handleStockChange(s, e.target.value)
                        }
                        className={`flex-1 border-b py-2 bg-transparent outline-none ${
                          active
                            ? "border-black"
                            : "border-gray-200 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= SIZES ================= */}
          <section>
            <p className="text-xs tracking-[0.3em] font-medium mb-4">
              AVAILABLE SIZES
            </p>
            <div className="flex gap-3 flex-wrap">
              {defaultSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-7 py-2.5 text-xs tracking-widest rounded-full transition ${
                    sizes.includes(size)
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* ================= BESTSELLER ================= */}
          <section className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller(!bestSeller)}
              className="scale-125"
            />
            <span className="text-xs tracking-widest uppercase">
              Feature as Bestseller
            </span>
          </section>

          {/* ================= SUBMIT ================= */}
          <section className="pt-6">
            <button
              disabled={loading}
              className="w-full sm:w-auto px-16 sm:px-24 py-4 bg-black text-white text-xs tracking-[0.35em] rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "ADDING PRODUCT..." : "ADD PRODUCT"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default Add;
