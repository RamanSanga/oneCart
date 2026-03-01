import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItem, setCartItemState] = useState({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const currency = "₹";
  const delivery_fee = 40;

  /* ================= PRODUCTS ================= */
  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/product/list`);
      setProducts(result.data?.products || result.data || []);
    } catch {
      setProducts([]);
    }
  };

  /* ================= WISHLIST ================= */
  const getWishlist = async () => {
    if (!userData) return;
    try {
      const res = await axios.get(
        `${serverUrl}/api/wishlist/get`,
        { withCredentials: true }
      );
      setWishlistItems(res.data.products || []);
    } catch (err) {
      console.log("Wishlist error:", err?.message);
    }
  };

  const getWishlistCount = () => wishlistItems.length;

  /* ================= CART ================= */
  const getUserCart = async () => {
    if (!userData) return;
    try {
      const result = await axios.get(
        `${serverUrl}/api/cart/get`,
        { withCredentials: true }
      );
      setCartItemState(result.data?.cartData || {});
    } catch {}
  };

  const addToCart = async (itemId, size) => {
    if (!userData) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/cart/add`,
        { itemId, size },
        { withCredentials: true }
      );
      setCartItemState(res.data.cartData || {});
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  const getCartCount = () => {
    let total = 0;
    for (const id in cartItem) {
      for (const size in cartItem[id]) {
        total += cartItem[id][size];
      }
    }
    return total;
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    getProducts();
  }, [serverUrl]);

  useEffect(() => {
    if (userData) {
      getUserCart();
      getWishlist();
    } else {
      setWishlistItems([]);
      setCartItemState({});
    }
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
    wishlistItems,
    getWishlist,
    getWishlistCount,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
