import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { useToast } from "./ToastContext";

export const shopDataContext = createContext();

const updateCartState = (currentCart, itemId, size, quantity) => {
  const nextCart = { ...currentCart };
  const productEntry = { ...(nextCart[itemId] || {}) };

  if (quantity <= 0) {
    delete productEntry[size];

    if (Object.keys(productEntry).length === 0) {
      delete nextCart[itemId];
    } else {
      nextCart[itemId] = productEntry;
    }

    return nextCart;
  }

  productEntry[size] = quantity;
  nextCart[itemId] = productEntry;

  return nextCart;
};

const getCartCountFromState = (cartItem) =>
  Object.values(cartItem || {}).reduce(
    (total, productSizes) =>
      total +
      Object.values(productSizes || {}).reduce(
        (sum, qty) => sum + Number(qty || 0),
        0
      ),
    0
  );

function ShopContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItem, setCartItemState] = useState(() => {
    // Initialize from localStorage for guest users
    const savedCart = localStorage.getItem("guestCart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [shopError, setShopError] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // --- RECENTLY VIEWED STATE ---
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        setRecentlyViewed([]);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem("recentlyViewed", JSON.stringify(next));
      return next;
    });
  }, []);

  const getRecommendations = useCallback((categoryId, currentProductId) => {
    if (!products.length) return [];
    return products
      .filter((p) => p.category === categoryId && p._id !== currentProductId)
      .slice(0, 4);
  }, [products]);

  const getStockForSize = useCallback((product, size) => {
    if (!product) return 0;
    if (typeof product.stock === "number") return product.stock;
    if (typeof product.stock === "object" && product.stock !== null) {
      return Number(product.stock[size] || 0);
    }
    return 0;
  }, []);

  const productsRequestRef = useRef(null);
  const cartRequestRef = useRef(null);
  const wishlistRequestRef = useRef(null);
  const hasBootstrappedProductsRef = useRef(false);
  const isMergingCartRef = useRef(false);

  const currency = "₹";
  const delivery_fee = 40;

  const showNetworkError = useCallback(
    (error, fallbackMessage) => {
      toast.error({
        title: fallbackMessage,
        message:
          error?.response?.data?.message || error?.message || "Please try again.",
        dedupeKey: `error:${fallbackMessage}`,
      });
    },
    [toast]
  );

  const getProducts = useCallback(async () => {
    if (productsRequestRef.current) return productsRequestRef.current;
    setProductsLoading(true);
    const request = axios.get(`${serverUrl}/api/product/list`);
    productsRequestRef.current = request;
    try {
      const result = await request;
      const nextProducts = result.data?.products || result.data || [];
      console.log("Fetched products:", nextProducts.length);
      setProducts(nextProducts);
      return nextProducts;
    } catch (error) {
      console.error("Products fetch failed:", error);
      showNetworkError(error, "Unable to load products");
      return [];
    } finally {
      productsRequestRef.current = null;
      setProductsLoading(false);
    }
  }, [serverUrl, showNetworkError]);

  const getWishlist = useCallback(async () => {
    if (!userData) {
      setWishlistItems([]);
      return [];
    }
    if (wishlistRequestRef.current) return wishlistRequestRef.current;
    setWishlistLoading(true);
    const request = axios.get(`${serverUrl}/api/wishlist/get`, { withCredentials: true });
    wishlistRequestRef.current = request;
    try {
      const res = await request;
      const nextWishlist = res.data.products || [];
      setWishlistItems(nextWishlist);
      return nextWishlist;
    } catch (error) {
      showNetworkError(error, "Unable to load wishlist");
      return [];
    } finally {
      wishlistRequestRef.current = null;
      setWishlistLoading(false);
    }
  }, [serverUrl, userData, showNetworkError]);

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item?._id).filter(Boolean)),
    [wishlistItems]
  );

  const isWishlisted = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  const toggleWishlist = useCallback(
    async (product) => {
      if (!userData) {
        toast.info({
          title: "Sign in to save favorites",
          message: "Keep your wishlist synced across all your devices.",
          dedupeKey: "wishlist:auth:prompt",
          actions: [
            { label: "Sign in", variant: "primary", onClick: () => navigate("/login") },
          ],
        });
        return { success: false, message: "Login required" };
      }

      const productId = typeof product === "string" ? product : product?._id;
      const currentlyWishlisted = wishlistIds.has(productId);
      const endpoint = currentlyWishlisted ? "remove" : "add";

      // Optimistic update
      setWishlistItems((prev) =>
        currentlyWishlisted
          ? prev.filter((item) => item._id !== productId)
          : [...prev, typeof product === "object" ? product : { _id: productId }]
      );

      try {
        await axios.post(`${serverUrl}/api/wishlist/${endpoint}`, { productId }, { withCredentials: true });
        toast.success({
          title: currentlyWishlisted ? "Removed from wishlist" : "Added to wishlist",
          message: currentlyWishlisted ? "Item removed." : "Item saved to your wishlist.",
          dedupeKey: `wishlist:${productId}`,
        });
        return { success: true };
      } catch (error) {
        getWishlist(); // Revert on error
        showNetworkError(error, "Wishlist update failed");
        return { success: false };
      }
    },
    [userData, wishlistIds, serverUrl, navigate, toast, showNetworkError, getWishlist]
  );

  const getUserCart = useCallback(async () => {
    if (!userData) return {};
    if (cartRequestRef.current) return cartRequestRef.current;
    setCartLoading(true);
    const request = axios.get(`${serverUrl}/api/cart/get`, { withCredentials: true });
    cartRequestRef.current = request;
    try {
      const result = await request;
      const nextCart = result.data?.cartData || {};
      setCartItemState(nextCart);
      return nextCart;
    } catch (error) {
      showNetworkError(error, "Unable to load cart");
      return {};
    } finally {
      cartRequestRef.current = null;
      setCartLoading(false);
    }
  }, [serverUrl, userData, showNetworkError]);

  const cartCount = useMemo(() => getCartCountFromState(cartItem), [cartItem]);

  const addToCart = useCallback(
    async (itemId, size) => {
      if (!itemId || !size) {
        toast.error({ title: "Select a size", message: "Choose a size first." });
        return { success: false };
      }

      // Optimistic update
      setCartItemState((prev) => {
        const next = updateCartState(prev, itemId, size, Number(prev?.[itemId]?.[size] || 0) + 1);
        if (!userData) localStorage.setItem("guestCart", JSON.stringify(next));
        return next;
      });

      if (userData) {
        try {
          const res = await axios.post(`${serverUrl}/api/cart/add`, { itemId, size }, { withCredentials: true });
          if (res.data?.cartData) setCartItemState(res.data.cartData);
        } catch (error) {
          getUserCart(); // Revert on error
          showNetworkError(error, "Sync failed");
        }
      }

      toast.success({
        title: "Added to cart",
        message: "Item is ready in your bag.",
        dedupeKey: `cart:add:${itemId}`,
        actions: [{ label: "View Cart", variant: "primary", onClick: () => navigate("/cart") }],
      });

      return { success: true };
    },
    [userData, serverUrl, navigate, toast, showNetworkError, getUserCart]
  );

  const updateQuantity = useCallback(
    async (itemId, size, quantity) => {
      setCartItemState((prev) => {
        const next = updateCartState(prev, itemId, size, quantity);
        if (!userData) localStorage.setItem("guestCart", JSON.stringify(next));
        return next;
      });

      if (userData) {
        try {
          const res = await axios.post(`${serverUrl}/api/cart/update`, { itemId, size, quantity }, { withCredentials: true });
          if (res.data?.cartData) setCartItemState(res.data.cartData);
        } catch (error) {
          getUserCart();
          showNetworkError(error, "Update failed");
        }
      }
    },
    [userData, serverUrl, getUserCart, showNetworkError]
  );

  const removeCartItem = useCallback(
    async (itemId, size) => {
      await updateQuantity(itemId, size, 0);
      toast.info({ title: "Removed", message: "Item removed from bag." });
    },
    [updateQuantity, toast]
  );

  const mergeCart = useCallback(async () => {
    if (!userData || isMergingCartRef.current) return;
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
    if (Object.keys(guestCart).length === 0) {
      getUserCart();
      return;
    }

    isMergingCartRef.current = true;
    try {
      // Simple merge logic: send guest items to server
      for (const [itemId, sizes] of Object.entries(guestCart)) {
        for (const [size, qty] of Object.entries(sizes)) {
          await axios.post(`${serverUrl}/api/cart/add`, { itemId, size, quantity: qty }, { withCredentials: true });
        }
      }
      localStorage.removeItem("guestCart");
      await getUserCart();
    } catch (error) {
      console.error("Cart merge failed", error);
    } finally {
      isMergingCartRef.current = false;
    }
  }, [userData, serverUrl, getUserCart]);

  const getCartAmount = useCallback(() => {
    return Object.entries(cartItem).reduce((total, [pid, sizes]) => {
      const product = products.find((p) => p._id === pid);
      if (!product) return total;
      return total + Object.values(sizes).reduce((sum, qty) => sum + qty * product.price, 0);
    }, 0);
  }, [cartItem, products]);

  const applyCoupon = useCallback(async (code) => {
    if (!code) return { success: false, message: "Enter a code" };
    
    try {
      const subtotal = getCartAmount();
      const res = await axios.post(`${serverUrl}/api/coupon/validate`, {
        code: code.toUpperCase(),
        orderAmount: subtotal
      }, { withCredentials: true });

      if (res.data.success) {
        setAppliedCoupon(code.toUpperCase());
        setDiscountAmount(res.data.discount);
        toast.success({ 
          title: "Coupon Applied", 
          message: `You saved ${currency}${res.data.discount.toFixed(2)}!` 
        });
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid coupon";
      toast.error({ title: "Failed", message: msg });
      return { success: false, message: msg };
    }
  }, [getCartAmount, serverUrl, currency, toast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.info({ title: "Coupon Removed", message: "Discount has been cleared." });
  }, [toast]);

  useEffect(() => {
    if (!hasBootstrappedProductsRef.current && serverUrl) {
      hasBootstrappedProductsRef.current = true;
      getProducts();
    }
  }, [getProducts, serverUrl]);

  useEffect(() => {
    if (userData) {
      mergeCart();
      getWishlist();
    } else {
      setWishlistItems([]);
      const saved = localStorage.getItem("guestCart");
      setCartItemState(saved ? JSON.parse(saved) : {});
    }
  }, [userData, getWishlist, mergeCart]);

  const value = useMemo(
    () => ({
      products,
      productsLoading,
      currency,
      delivery_fee,
      cartItem,
      cartCount,
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      recentlyViewed,
      addToRecentlyViewed,
      getRecommendations,
      getStockForSize,
      addToCart,
      updateQuantity,
      removeCartItem,
      getCartAmount,
      setCartItem: setCartItemState,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      discountAmount,
      toggleWishlist,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      serverUrl,
    }),
    [
      products,
      productsLoading,
      cartItem,
      cartCount,
      wishlistItems,
      isWishlisted,
      recentlyViewed,
      addToRecentlyViewed,
      getRecommendations,
      getStockForSize,
      addToCart,
      updateQuantity,
      removeCartItem,
      getCartAmount,
      setCartItemState,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      discountAmount,
      toggleWishlist,
      search,
      showSearch,
      serverUrl,
    ]
  );

  return <shopDataContext.Provider value={value}>{children}</shopDataContext.Provider>;
}

export default ShopContext;
