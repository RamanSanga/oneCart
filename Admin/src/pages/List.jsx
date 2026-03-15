import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import {
  Trash2,
  Plus,
  Package,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

function List() {
  const { serverUrl } = useContext(authDataContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [localStock, setLocalStock] = useState({});
  const [newSizeInputs, setNewSizeInputs] = useState({});
  const [updating, setUpdating] = useState({});
  const [updatingPrice, setUpdatingPrice] = useState({});

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/product/list`, {
        withCredentials: true,
      });

      const products = Array.isArray(res.data) ? res.data : [];
      setList(products);

      const initial = {};
      products.forEach((p) => {
        const stockObj =
          p.stock && typeof p.stock === "object"
            ? p.stock.toObject
              ? p.stock.toObject()
              : { ...p.stock }
            : {};
        (p.sizes || []).forEach((sz) => {
          initial[`${p._id}_${sz}`] = Number(stockObj[sz] || 0);
        });
      });
      setLocalStock(initial);
      setNewSizeInputs({});
    } catch (err) {
      console.error("Failed to fetch product list:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const getTotalStock = (stock = {}) =>
    Object.values(stock).reduce((s, v) => s + Number(v || 0), 0);

  const saveStock = async (productId, size) => {
    const key = `${productId}_${size}`;
    const value = Number(localStock[key] || 0);

    try {
      setUpdating((u) => ({ ...u, [key]: true }));

      const res = await axios.put(
        `${serverUrl}/api/product/update-stock`,
        { id: productId, size, stock: value },
        { withCredentials: true }
      );

      const updated = res.data;
      if (updated?._id) {
        setList((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        setLocalStock((ls) => ({ ...ls, [key]: value }));
      } else {
        await fetchList();
      }
    } catch (err) {
      alert("Stock update failed");
      console.error(err);
    } finally {
      setUpdating((u) => ({ ...u, [key]: false }));
    }
  };

  const savePrice = async (productId, price) => {
    try {
      setUpdatingPrice((p) => ({ ...p, [productId]: true }));

      await axios.put(
        `${serverUrl}/api/product/update-price`,
        { id: productId, price },
        { withCredentials: true }
      );
    } catch (err) {
      alert("Price update failed");
      console.error(err);
    } finally {
      setUpdatingPrice((p) => ({ ...p, [productId]: false }));
    }
  };

  const handleAddSize = async (productId) => {
    const input = newSizeInputs[productId] || {};
    const size = input.size;
    const qty = Number(input.qty || 0);

    if (!size) return alert("Select size");
    if (isNaN(qty) || qty < 0) return alert("Enter valid quantity");

    const key = `${productId}_${size}`;
    try {
      setUpdating((u) => ({ ...u, [u]: true }));

      const res = await axios.put(
        `${serverUrl}/api/product/update-stock`,
        { id: productId, size, stock: qty },
        { withCredentials: true }
      );

      const updated = res.data;
      if (updated?._id) {
        setList((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        setLocalStock((ls) => ({ ...ls, [key]: qty }));
        setNewSizeInputs((ns) => ({
          ...ns,
          [productId]: { size: "", qty: 0 },
        }));
      } else {
        await fetchList();
      }
    } catch (err) {
      alert("Add size failed");
      console.error(err);
    } finally {
      setUpdating((u) => ({ ...u, [key]: false }));
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.post(
        `${serverUrl}/api/product/remove/${id}`,
        {},
        { withCredentials: true }
      );
      setList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f7f3]">
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 lg:py-10">
        {/* HEADER */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gray-500 mb-2">
                Inventory Control
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.03em] uppercase">
                Product Inventory
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl">
                Review products, update price, manage stock per size, and maintain
                a clean premium inventory system.
              </p>
            </div>

            <button
              onClick={fetchList}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-black bg-black text-white px-5 sm:px-6 py-3 text-xs sm:text-sm tracking-[0.18em] uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center text-gray-500">
            Loading inventory...
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {list.map((item) => {
              const stockObj =
                item.stock && typeof item.stock === "object"
                  ? item.stock.toObject
                    ? item.stock.toObject()
                    : { ...item.stock }
                  : {};

              const totalStock = getTotalStock(stockObj);

              return (
                <div
                  key={item._id}
                  className="rounded-3xl border border-black/5 bg-white p-4 sm:p-5 lg:p-6 xl:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex flex-col 2xl:flex-row gap-6 lg:gap-8">
                    {/* IMAGE */}
                    <div className="w-full 2xl:w-auto">
                      <img
                        src={item.image1}
                        className="w-full sm:w-[180px] lg:w-[220px] h-[240px] sm:h-[220px] lg:h-[260px] object-cover rounded-3xl"
                        alt={item.name}
                      />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5 mb-6">
                        <div className="min-w-0">
                          <h2 className="text-xl sm:text-2xl font-medium tracking-wide break-words">
                            {item.name}
                          </h2>
                          <p className="text-sm sm:text-base text-gray-500 mt-2">
                            {item.category} · {item.subCategory}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f7f3] border border-black/5 px-4 py-2 text-xs sm:text-sm">
                              <Package size={14} />
                              Stock:{" "}
                              <span
                                className={`font-medium ${
                                  totalStock === 0
                                    ? "text-red-600"
                                    : totalStock <= 5
                                    ? "text-yellow-700"
                                    : "text-green-700"
                                }`}
                              >
                                {totalStock}
                              </span>
                            </span>

                            {item.bestSeller && (
                              <span className="rounded-full bg-black text-white px-4 py-2 text-xs sm:text-sm">
                                Bestseller
                              </span>
                            )}
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="w-full xl:w-auto rounded-3xl border border-black/5 bg-[#fafaf8] p-4 sm:p-5 xl:min-w-[220px]">
                          <p className="text-[10px] tracking-[0.28em] uppercase text-gray-500 mb-3">
                            Price
                          </p>

                          <div className="flex items-center gap-2">
                            <IndianRupee size={18} />
                            <input
                              type="number"
                              value={item.price}
                              disabled={updatingPrice[item._id]}
                              onChange={(e) =>
                                setList((prev) =>
                                  prev.map((p) =>
                                    p._id === item._id
                                      ? { ...p, price: e.target.value }
                                      : p
                                  )
                                )
                              }
                              onBlur={() => savePrice(item._id, item.price)}
                              className="w-full bg-transparent outline-none text-xl sm:text-2xl font-medium"
                            />
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Edit and click outside to save
                          </p>
                        </div>
                      </div>

                      {/* SIZE GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                        {(item.sizes || []).map((sz) => {
                          const key = `${item._id}_${sz}`;
                          const qty = Number(
                            localStock[key] ?? Number(stockObj[sz] ?? 0)
                          );

                          return (
                            <div
                              key={sz}
                              className="rounded-3xl border border-black/5 bg-[#fafaf8] p-4"
                            >
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <span className="font-medium">{sz}</span>

                                {qty === 0 && (
                                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-100 text-red-700 uppercase tracking-wide">
                                    Out
                                  </span>
                                )}

                                {qty > 0 && qty <= 3 && (
                                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                                    Low
                                  </span>
                                )}
                              </div>

                              <input
                                type="number"
                                min={0}
                                value={
                                  localStock[key] !== undefined
                                    ? localStock[key]
                                    : qty
                                }
                                disabled={!!updating[key]}
                                onChange={(e) =>
                                  setLocalStock((p) => ({
                                    ...p,
                                    [key]: e.target.value,
                                  }))
                                }
                                onBlur={() => saveStock(item._id, sz)}
                                className="w-full bg-transparent outline-none text-lg"
                              />

                              <p className="text-[11px] text-gray-500 mt-2">
                                Edit and click outside
                              </p>
                            </div>
                          );
                        })}

                        {/* ADD SIZE BUTTON */}
                        <button
                          onClick={() =>
                            setNewSizeInputs((ns) => ({
                              ...ns,
                              [item._id]: { size: "", qty: 0 },
                            }))
                          }
                          className="rounded-3xl border-2 border-dashed border-black/10 p-4 flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition min-h-[130px]"
                        >
                          <Plus size={20} />
                          <span className="text-xs mt-2 uppercase tracking-[0.15em]">
                            Add Size
                          </span>
                        </button>
                      </div>

                      {/* ADD SIZE PANEL */}
                      {newSizeInputs[item._id] && (
                        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-4 sm:p-5 lg:p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                Size
                              </label>
                              <select
                                value={newSizeInputs[item._id].size}
                                onChange={(e) =>
                                  setNewSizeInputs((ns) => ({
                                    ...ns,
                                    [item._id]: {
                                      ...ns[item._id],
                                      size: e.target.value,
                                    },
                                  }))
                                }
                                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none"
                              >
                                <option value="">Select</option>
                                {ALL_SIZES.filter(
                                  (s) => !(item.sizes || []).includes(s)
                                ).map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={newSizeInputs[item._id].qty}
                                onChange={(e) =>
                                  setNewSizeInputs((ns) => ({
                                    ...ns,
                                    [item._id]: {
                                      ...ns[item._id],
                                      qty: e.target.value,
                                    },
                                  }))
                                }
                                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none"
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:justify-end lg:items-end">
                              <button
                                onClick={() => handleAddSize(item._id)}
                                className="w-full rounded-2xl bg-black text-white px-6 py-3 text-xs sm:text-sm uppercase tracking-[0.18em]"
                              >
                                Add
                              </button>

                              <button
                                onClick={() =>
                                  setNewSizeInputs((ns) => {
                                    const copy = { ...ns };
                                    delete copy[item._id];
                                    return copy;
                                  })
                                }
                                className="w-full rounded-2xl border border-black/10 px-6 py-3 text-xs sm:text-sm uppercase tracking-[0.18em]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DELETE */}
                    <div className="flex 2xl:flex-col justify-end items-end">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="w-11 h-11 rounded-2xl border border-black/10 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 transition"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default List;
