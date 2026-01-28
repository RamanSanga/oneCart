import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import axios from "axios";
import { authDataContext } from "./authContext";
import { userDataContext } from "./userContext";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  const [products, setProducts] = useState([]);
  const [cartItem, setCartItemState] = useState(() => {
    try {
      const raw = localStorage.getItem("cartItem");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const currency = "₹";
  const delivery_fee = 40;

  // persist local copy and update state
  const setCartItem = (newCart) => {
    setCartItemState(newCart);
    try {
      localStorage.setItem("cartItem", JSON.stringify(newCart));
    } catch {}
  };

  /* ================= PRODUCTS ================= */
  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product/list`);
      // backend may return array or { products: [...] }
      setProducts(result.data?.products || result.data || []);
    } catch (error) {
      console.log("getProducts error:", error?.message || error);
      setProducts([]);
    }
  };

  /* ================= GET USER CART FROM SERVER ================= */
  const getUserCart = async () => {
    if (!userData) return;
    try {
      const result = await axios.get(`${serverUrl}/api/cart/get`, { withCredentials: true });
      const serverCart = result.data?.cartData || {};
      setCartItem(serverCart);
    } catch (err) {
      console.log("getUserCart error:", err?.message || err);
    }
  };

  /* ================ HELPER: clone ================ */
  const clone = (obj) => {
    try {
      return structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
    } catch {
      return {};
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId, size) => {
    if (!itemId || !size) return;

    // update local UI immediately
    const next = clone(cartItem);
    if (!next[itemId]) next[itemId] = {};
    next[itemId][size] = (next[itemId][size] || 0) + 1;
    setCartItem(next);

    // if logged in, persist to server and use server response authoritative
    if (userData) {
      try {
        const res = await axios.post(
          `${serverUrl}/api/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );
        setCartItem(res.data.cartData || {});
      } catch (err) {
        console.log("addToCart server error:", err?.response?.data || err?.message);
      }
    }
  };

  /* ================= UPDATE CART (quantity) ================= */
  const updateQuantity = async (itemId, size, quantity) => {
    if (!itemId || !size) return;

    const next = clone(cartItem);
    if (!next[itemId]) next[itemId] = {};
    if (quantity <= 0) {
      delete next[itemId][size];
      if (Object.keys(next[itemId] || {}).length === 0) delete next[itemId];
    } else {
      next[itemId][size] = quantity;
    }
    setCartItem(next);

    if (userData) {
      try {
        const res = await axios.post(
          `${serverUrl}/api/cart/update`,
          { itemId, size, quantity },
          { withCredentials: true }
        );
        setCartItem(res.data.cartData || {});
      } catch (err) {
        console.log("updateQuantity server error:", err?.response?.data || err?.message);
      }
    }
  };

  /* ================= REMOVE CART ITEM ================= */
  const removeCartItem = async (itemId, size) => {
    const next = clone(cartItem);
    if (next[itemId]) {
      delete next[itemId][size];
      if (Object.keys(next[itemId] || {}).length === 0) delete next[itemId];
    }
    setCartItem(next);

    if (userData) {
      try {
        await axios.post(
          `${serverUrl}/api/cart/update`,
          { itemId, size, quantity: 0 },
          { withCredentials: true }
        );
        // refresh server cart
        const res = await axios.get(`${serverUrl}/api/cart/get`, { withCredentials: true });
        setCartItem(res.data?.cartData || {});
      } catch (err) {
        console.log("removeCartItem server error:", err?.response?.data || err?.message);
      }
    }
  };

  /* ================= CART COUNT ================= */
  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        totalCount += cartItem[productId][size];
      }
    }
    return totalCount;
  };

  const getCartAmount = async () => {
    let totalAmount = 0;
    for (const productId in cartItem) {
      const product = products.find((prod) => prod._id === productId);
      if (product) {
        for (const size in cartItem[productId]) {
          const qty = cartItem[productId][size];
          if (qty > 0) totalAmount += product.price * qty;
        }
      }
    }
    return totalAmount;
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, [serverUrl]);

  // when user logs in, refresh cart from server (server is authoritative)
  useEffect(() => {
    if (userData) {
      getUserCart();
    }
    // do not overwrite guest local cart immediately on logout; keep localStorage
    // eslint-disable-next-line
  }, [userData]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addToCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
    removeCartItem,
  };

  return <shopDataContext.Provider value={value}>{children}</shopDataContext.Provider>;
}

export default ShopContext;