import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Nav from "../component/Nav.jsx";
import SideBar from "../component/SideBar.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { Trash2, Plus } from "lucide-react";

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

  // ================= STOCK =================
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

  // ================= PRICE (PREMIUM INLINE) =================
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

  // ================= ADD SIZE =================
  const handleAddSize = async (productId) => {
    const input = newSizeInputs[productId] || {};
    const size = input.size;
    const qty = Number(input.qty || 0);

    if (!size) return alert("Select size");
    if (isNaN(qty) || qty < 0) return alert("Enter valid quantity");

    const key = `${productId}_${size}`;
    try {
      setUpdating((u) => ({ ...u, [key]: true }));

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
    <div className="min-h-screen bg-[#f7f7f7]">
      <Nav />
      <SideBar />

      <div className="ml-[80px] pt-[100px] px-4 sm:px-8 lg:px-12 max-w-[1700px]">
        <h1 className="text-[18px] sm:text-[22px] font-light tracking-[0.35em] mb-14">
          PRODUCT INVENTORY
        </h1>

        {loading ? (
          <div className="pt-32 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-8">
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
                  className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex flex-col xl:flex-row gap-8">
                    {/* IMAGE */}
                    <img
                      src={item.image1}
                      className="w-full sm:w-[160px] h-[220px] sm:h-[180px] object-cover rounded-2xl"
                      alt={item.name}
                    />

                    {/* INFO */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div>
                          <h2 className="text-xl font-medium tracking-wide">
                            {item.name}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.category} · {item.subCategory}
                          </p>
                        </div>

                        {/* ===== PREMIUM PRICE EDITOR ===== */}
                        <div className="sm:text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-lg font-light">₹</span>
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
                              onBlur={() =>
                                savePrice(item._id, item.price)
                              }
                              className="w-[110px] text-lg font-medium bg-transparent border-b border-gray-300 focus:border-black outline-none transition"
                            />
                          </div>

                          <p className="text-xs text-gray-400 mt-1">
                            Click & edit · Auto save
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            Total Stock:{" "}
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
                          </p>
                        </div>
                      </div>

                      {/* ===== SIZE GRID (UNCHANGED LOGIC) ===== */}
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(item.sizes || []).map((sz) => {
                          const key = `${item._id}_${sz}`;
                          const qty = Number(
                            localStock[key] ??
                              Number(stockObj[sz] ?? 0)
                          );

                          return (
                            <div
                              key={sz}
                              className="border rounded-2xl p-4 flex flex-col gap-2 bg-[#fafafa]"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium tracking-wide">
                                  {sz}
                                </span>

                                {qty === 0 && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                    OUT
                                  </span>
                                )}

                                {qty > 0 && qty <= 3 && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                    LOW
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
                                className="w-full border-b bg-transparent text-sm py-1 outline-none focus:border-black"
                              />

                              <p className="text-[11px] text-gray-400">
                                Edit & click outside
                              </p>
                            </div>
                          );
                        })}

                        {/* ADD SIZE */}
                        <button
                          onClick={() =>
                            setNewSizeInputs((ns) => ({
                              ...ns,
                              [item._id]: { size: "", qty: 0 },
                            }))
                          }
                          className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition"
                        >
                          <Plus size={18} />
                          <span className="text-xs mt-2">
                            Add Size
                          </span>
                        </button>
                      </div>

                      {/* ADD SIZE PANEL */}
                      {newSizeInputs[item._id] && (
                        <div className="mt-6 p-6 border rounded-2xl bg-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500">
                              Size
                            </label>
                            <select
                              value={
                                newSizeInputs[item._id].size
                              }
                              onChange={(e) =>
                                setNewSizeInputs((ns) => ({
                                  ...ns,
                                  [item._id]: {
                                    ...ns[item._id],
                                    size: e.target.value,
                                  },
                                }))
                              }
                              className="block border px-3 py-2 mt-1 w-full rounded-md"
                            >
                              <option value="">Select</option>
                              {ALL_SIZES.filter(
                                (s) =>
                                  !(item.sizes || []).includes(s)
                              ).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs text-gray-500">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={
                                newSizeInputs[item._id].qty
                              }
                              onChange={(e) =>
                                setNewSizeInputs((ns) => ({
                                  ...ns,
                                  [item._id]: {
                                    ...ns[item._id],
                                    qty: e.target.value,
                                  },
                                }))
                              }
                              className="block border px-3 py-2 mt-1 w-full rounded-md"
                            />
                          </div>

                          <div className="flex gap-3 items-end">
                            <button
                              onClick={() =>
                                handleAddSize(item._id)
                              }
                              className="flex-1 px-6 py-2 bg-black text-white text-xs tracking-widest rounded-md"
                            >
                              ADD
                            </button>

                            <button
                              onClick={() =>
                                setNewSizeInputs((ns) => {
                                  const copy = { ...ns };
                                  delete copy[item._id];
                                  return copy;
                                })
                              }
                              className="flex-1 px-4 py-2 border text-xs rounded-md"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DELETE */}
                    <div className="flex xl:flex-col justify-end items-end">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="text-gray-400 hover:text-red-600 transition"
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
      </div>
    </div>
  );
}

export default List;
