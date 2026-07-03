import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { useToast }         from "../Context/ToastContext";
import {
  FiChevronRight, FiStar, FiTruck, FiRefreshCw,
  FiShield, FiShoppingBag, FiHeart, FiX, FiBell, FiPlus, FiMinus,
} from "react-icons/fi";
import axios from "axios";
import Card  from "../component/Card";
import OurPolicy from "../component/OurPolicy";

/* ─────────────────────────────────────────────
   ProductDetail
───────────────────────────────────────────── */
export default function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const toast      = useToast();

  const {
    products, currency, addToCart,
    toggleWishlist, isWishlisted,
    addToRecentlyViewed, getRecommendations, serverUrl,
  } = useContext(shopDataContext);

  const { userData } = useContext(userDataContext);
  const isLoggedIn   = Boolean(userData?._id || userData?.name);

  const [product,       setProduct]       = useState(null);
  const [activeImage,   setActiveImage]   = useState("");
  const [selectedSize,  setSelectedSize]  = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [cartPending,   setCartPending]   = useState(false);
  const [wlPending,     setWlPending]     = useState(false);
  const [showSticky,    setShowSticky]    = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(null);

  // Reviews
  const [reviews,       setReviews]       = useState([]);
  const [reviewStats,   setReviewStats]   = useState({ totalReviews: 0, averageRating: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRating,    setUserRating]    = useState(5);
  const [userComment,   setUserComment]   = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [showForm,      setShowForm]      = useState(false);

  const wishlisted        = isWishlisted(id);
  const recommendations   = useMemo(() =>
    product ? getRecommendations(product.category, product._id) : [],
    [product, getRecommendations]
  );

  /* ── Load product ── */
  useEffect(() => {
    const item = products.find(p => p._id === id);
    if (item) {
      setProduct(item);
      setActiveImage(item.image1);
      setQuantity(1);
      addToRecentlyViewed(id);
      fetchReviews();
      if (item.sizes?.length > 0) setSelectedSize(item.sizes[0]);
    }
  }, [id, products]);

  /* ── Reviews ── */
  const fetchReviews = useCallback(async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(`${serverUrl}/api/review/product/${id}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
        setReviewStats(res.data.stats);
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setReviewLoading(false);
    }
  }, [id, serverUrl]);

  /* ── Sticky bar on scroll ── */
  useEffect(() => {
    const h = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const promptAuth = useCallback(msg => {
    toast.info({
      title: "Sign in to continue",
      message: msg,
      dedupeKey: `product:${id}:auth`,
      actions: [
        { label: "Sign in",       variant: "primary", onClick: () => navigate("/login",  { state: { from: location } }) },
        { label: "Create account",                    onClick: () => navigate("/signup", { state: { from: location } }) },
      ],
    });
  }, [id, location, navigate, toast]);

  const handleAddToCart = async () => {
    if (!product || cartPending) return;
    if (!isLoggedIn) { promptAuth("Sign in to add items to your bag."); return; }
    if (!selectedSize) { toast.error("Please select a size"); return; }
    setCartPending(true);
    for (let i = 0; i < quantity; i++) await addToCart(id, selectedSize);
    setCartPending(false);
  };

  const handleWishlistToggle = async () => {
    if (!product || wlPending) return;
    if (!isLoggedIn) { promptAuth("Sign in to save items."); return; }
    setWlPending(true);
    await toggleWishlist(product);
    setWlPending(false);
  };

  const handleStockNotify = async () => {
    if (!selectedSize) { toast.error("Select a size first"); return; }
    const email = userData?.email || window.prompt("Enter your email to be notified when this size returns:");
    if (!email) return;
    try {
      const res = await axios.post(`${serverUrl}/api/stock-alert/add`, { productId: id, size: selectedSize, email });
      if (res.data.success) toast.success("Notification set! We'll email you when it's back.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set alert");
    }
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) { promptAuth("Sign in to leave a review."); return; }
    if (!userComment.trim()) { toast.error("Please write a comment"); return; }
    try {
      setSubmitting(true);
      const res = await axios.post(`${serverUrl}/api/review/add`,
        { productId: id, rating: userRating, comment: userComment },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success({ title: "Review submitted", message: "Thank you for your feedback." });
        setUserComment("");
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Not found / loading ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center" style={{ paddingTop: "var(--nav-height)" }}>
        <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[var(--ink)] opacity-60 animate-pulse">OneCart</p>
      </div>
    );
  }

  // Gather product images and supplement with matching editorial lifestyle/closeup campaign visuals
  let rawImages = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  if (product.category === "Men") {
    rawImages = [
      ...rawImages,
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"
    ];
  } else if (product.category === "Women") {
    rawImages = [
      ...rawImages,
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop"
    ];
  } else if (product.category === "Kids") {
    rawImages = [
      ...rawImages,
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600&auto=format&fit=crop"
    ];
  } else {
    rawImages = [
      ...rawImages,
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=600&auto=format&fit=crop"
    ];
  }
  const images = Array.from(new Set(rawImages)).slice(0, 4);

  const stockMap        = product.stock || {};
  const remainingStock  = typeof stockMap === "number" ? stockMap : (stockMap[selectedSize] || 0);
  const isOOS           = remainingStock <= 0;
  const isLowStock      = !isOOS && remainingStock <= 3;
  const maxQty          = Math.min(remainingStock, 5);

  const ACCORDION_ITEMS = [
    { id: "desc",    title: "Description",       content: product.description },
    { id: "care",    title: "Care Instructions",  content: "Machine wash cold at 30°C. Do not bleach. Tumble dry low. Iron on low heat. Do not dry clean." },
    { id: "shipping", title: "Shipping & Returns", content: "Free standard delivery on all orders. Returns accepted within 30 days of delivery. Items must be unworn and in original condition." },
  ];

  return (
    <div className="bg-[var(--cream)] min-h-screen" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-8">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--ink-40)] mb-10" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[var(--ink)] transition-colors">Home</Link>
          <FiChevronRight size={10} />
          <Link to="/collection" className="hover:text-[var(--ink)] transition-colors">Collections</Link>
          {product.category && (
            <>
              <FiChevronRight size={10} />
              <Link to={`/collection?category=${product.category}`} className="hover:text-[var(--ink)] transition-colors">{product.category}</Link>
            </>
          )}
          <FiChevronRight size={10} />
          <span className="text-[var(--ink)] truncate max-w-[180px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── GALLERY ── */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[640px] shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View image ${i + 1}`}
                  className={`shrink-0 w-16 md:w-[72px] aspect-[3/4] overflow-hidden transition-all border ${
                    activeImage === img ? "border-[var(--ink)]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-[#EEECEA] relative group cursor-zoom-in">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {isLowStock && !isOOS && (
                <div className="absolute top-4 left-4 bg-[var(--ink)] text-white text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1">
                  Only {remainingStock} left
                </div>
              )}
              {isOOS && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <span className="bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] px-4 py-2">Sold Out</span>
                </div>
              )}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Category + rating row */}
            <div className="flex items-center justify-between mb-4">
              <Link
                to={`/collection?category=${product.category}`}
                className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors"
              >
                {product.category} / {product.subCategory}
              </Link>
              {reviewStats.totalReviews > 0 && (
                <div className="flex items-center gap-1.5">
                  <StarRow rating={reviewStats.averageRating} />
                  <span className="text-[10px] text-[var(--ink-40)]">({reviewStats.totalReviews})</span>
                </div>
              )}
            </div>

            <h1
              className="font-display font-light text-[var(--ink)] leading-[1.1] mb-3"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              {product.name}
            </h1>

            <p className="text-[22px] font-light text-[var(--ink)] mb-8 tabular-nums">
              {currency}{product.price}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink)]">Size</p>
                <button className="text-[9px] font-medium uppercase tracking-widest text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors border-b border-[var(--ink-20)] pb-px">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => {
                  const sizeStock = typeof stockMap === "number" ? stockMap : (stockMap[size] || 0);
                  const oos = sizeStock <= 0;
                  return (
                    <button
                      key={size}
                      onClick={() => { if (!oos) { setSelectedSize(size); setQuantity(1); } }}
                      disabled={oos}
                      aria-pressed={selectedSize === size}
                      className={`min-w-[48px] h-[48px] px-3 border text-[12px] font-medium transition-all relative ${
                        selectedSize === size
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                          : oos
                          ? "border-[var(--border)] text-[var(--ink-20)] cursor-not-allowed line-through"
                          : "border-[var(--border-md)] text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            {!isOOS && (
              <div className="mb-8">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink)] mb-4">Quantity</p>
                <div className="inline-flex items-center border border-[var(--border-md)]">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-[var(--ink-40)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={13} />
                  </button>
                  <span className="w-10 text-center text-[13px] font-medium text-[var(--ink)] tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="w-10 h-10 flex items-center justify-center text-[var(--ink-40)] hover:text-[var(--ink)] disabled:opacity-20 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                type="button"
                disabled={cartPending || isOOS}
                onClick={handleAddToCart}
                className={`w-full py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3 ${
                  isOOS
                    ? "bg-[var(--border)] text-[var(--ink-40)] cursor-not-allowed"
                    : "bg-[var(--ink)] text-white hover:bg-[var(--ink-80)]"
                }`}
              >
                <FiShoppingBag size={14} />
                {cartPending ? "Adding…" : isOOS ? "Sold Out" : "Add to Bag"}
              </button>

              {isOOS && selectedSize && (
                <button
                  type="button"
                  onClick={handleStockNotify}
                  className="w-full py-4 border border-[var(--ink)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors flex items-center justify-center gap-3"
                >
                  <FiBell size={14} />
                  Notify When Available
                </button>
              )}

              <button
                type="button"
                disabled={wlPending}
                onClick={handleWishlistToggle}
                className={`w-full py-3.5 border text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3 ${
                  wishlisted
                    ? "border-[var(--ink)] text-[var(--ink)] bg-[var(--ink-06)]"
                    : "border-[var(--border-md)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                <FiHeart size={14} className={wishlisted ? "fill-current" : ""} />
                {wlPending ? "Updating…" : wishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust icons */}
            <div className="grid grid-cols-3 gap-3 pt-8 border-t border-[var(--border)]">
              {[
                { icon: <FiTruck size={14} />,     label: "Free Delivery" },
                { icon: <FiRefreshCw size={14} />, label: "30-Day Returns" },
                { icon: <FiShield size={14} />,    label: "Authenticity" },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center gap-2">
                  <div className="text-[var(--ink-40)]">{item.icon}</div>
                  <p className="text-[9px] font-medium uppercase tracking-widest text-[var(--ink-40)]">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-10 border-t border-[var(--border)]">
              {ACCORDION_ITEMS.map(item => (
                <div key={item.id} className="border-b border-[var(--border)]">
                  <button
                    onClick={() => setAccordionOpen(open => open === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-4 text-left"
                    aria-expanded={accordionOpen === item.id}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">{item.title}</p>
                    <span className="text-[var(--ink-40)] text-[18px] leading-none">
                      {accordionOpen === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {accordionOpen === item.id && (
                    <p className="text-[13px] font-light text-[var(--ink-60)] leading-relaxed pb-5 pr-6 slide-in-from-top">
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        {recommendations.length > 0 && (
          <section className="mt-28 pt-16 border-t border-[var(--border)]">
            <div className="mb-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-2">You may also like</p>
              <h2 className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(22px, 2.5vw, 34px)" }}>
                Related Pieces
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 gap-y-10">
              {recommendations.map(item => (
                <Card
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                  hoverImage={item.image2}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── REVIEWS ── */}
        <section className="mt-28 pt-16 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row gap-16">

            {/* Summary */}
            <div className="w-full md:w-72 shrink-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)] mb-8">Reviews</p>
              <div className="flex items-end gap-5 mb-6">
                <span className="font-display font-light text-[var(--ink)]" style={{ fontSize: "clamp(48px, 6vw, 72px)" }}>
                  {reviewStats.averageRating || "–"}
                </span>
                <div className="pb-2">
                  <StarRow rating={reviewStats.averageRating} />
                  <p className="text-[10px] text-[var(--ink-40)] mt-1 uppercase tracking-widest">{reviewStats.totalReviews} reviews</p>
                </div>
              </div>

              {/* Rating bars */}
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map(r => {
                  const count = reviews.filter(rv => rv.rating === r).length;
                  const pct   = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                  return (
                    <div key={r} className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--ink-40)] w-2 shrink-0">{r}</span>
                      <div className="flex-1 h-1 bg-[var(--border)]">
                        <div className="h-full bg-[var(--ink)] transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[var(--ink-20)] w-4 text-right tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review list */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-10">
                <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--ink-40)]">
                  {reviewLoading ? "Loading…" : `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {showForm && (
                <div className="mb-12 p-6 bg-white border border-[var(--border)] slide-in-from-top">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Share your experience</p>
                    <button onClick={() => setShowForm(false)} className="text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors">
                      <FiX size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-3">Rating</p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setUserRating(s)}
                            aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                            className={`transition-opacity ${s <= userRating ? "opacity-100" : "opacity-20"}`}
                          >
                            <FiStar size={22} fill={s <= userRating ? "currentColor" : "none"} className="text-[var(--ink)]" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-40)] mb-3">Comment</p>
                      <textarea
                        rows={4}
                        value={userComment}
                        onChange={e => setUserComment(e.target.value)}
                        placeholder="How is the fit and quality?"
                        className="w-full border-b border-[var(--border-md)] focus:border-[var(--ink)] outline-none bg-transparent text-[13px] font-light text-[var(--ink)] placeholder:text-[var(--ink-30)] pb-2 resize-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[var(--ink)] text-white px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Submitting…" : "Post Review"}
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-10 divide-y divide-[var(--border)]">
                {reviews.map(review => (
                  <ReviewCard
                    key={review._id}
                    author={review.userName}
                    date={new Date(review.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    rating={review.rating}
                    content={review.comment}
                  />
                ))}
                {reviews.length === 0 && !reviewLoading && (
                  <div className="py-16 text-center">
                    <p className="text-[13px] font-light text-[var(--ink-40)]">No reviews yet. Be the first to share your experience.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── STICKY BAR ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[var(--cream)]/95 backdrop-blur-sm border-t border-[var(--border)] py-3 px-6 transition-transform duration-400 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showSticky}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4 min-w-0">
            <div className="w-10 h-12 overflow-hidden bg-[#EEECEA] shrink-0">
              <img src={product.image1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[var(--ink)] truncate">{product.name}</p>
              <p className="text-[11px] text-[var(--ink-40)]">{currency}{product.price}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartPending || isOOS}
            className="flex-1 sm:flex-none sm:w-52 bg-[var(--ink)] text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--ink-80)] transition-colors disabled:opacity-40"
          >
            {cartPending ? "Adding…" : isOOS ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>

      <OurPolicy />
    </div>
  );
}

/* ── Star row ── */
function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <FiStar
          key={s}
          size={12}
          className="text-[var(--ink)]"
          fill={s <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

/* ── Review card ── */
function ReviewCard({ author, date, rating, content }) {
  return (
    <div className="pt-8 first:pt-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--ink-06)] border border-[var(--border)] flex items-center justify-center text-[11px] font-semibold text-[var(--ink-40)] uppercase shrink-0">
            {author?.charAt(0) || "?"}
          </div>
          <div>
            <p className="text-[12px] font-medium text-[var(--ink)]">{author}</p>
            <StarRow rating={rating} />
          </div>
        </div>
        <span className="text-[10px] text-[var(--ink-30)] uppercase tracking-widest shrink-0">{date}</span>
      </div>
      <p className="text-[13px] font-light text-[var(--ink-60)] leading-relaxed max-w-2xl">{content}</p>
    </div>
  );
}
