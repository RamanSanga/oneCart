import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import { userDataContext } from "../Context/UserContext";
import { useToast } from "../Context/ToastContext";
import { FiChevronRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiShoppingBag, FiHeart, FiX, FiBell } from "react-icons/fi";
import axios from "axios";
import Card from "../component/Card";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { 
    products, 
    currency, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    addToRecentlyViewed,
    getRecommendations,
    serverUrl,
  } = useContext(shopDataContext);

  const { userData } = useContext(userDataContext);
  const isLoggedIn = Boolean(userData?._id || userData?.name);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [cartPending, setCartPending] = useState(false);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  
  // REVIEW STATES
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);


  const wishlisted = isWishlisted(id);
  const recommendations = useMemo(() => 
    product ? getRecommendations(product.category, product._id) : [], 
    [product, getRecommendations]
  );

  const fetchReviews = useCallback(async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(`${serverUrl}/api/review/product/${id}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
        setReviewStats(res.data.stats);
      }
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
    } finally {
      setReviewLoading(false);
    }
  }, [id, serverUrl]);

  useEffect(() => {
    const item = products.find((p) => p._id === id);
    if (item) {
      setProduct(item);
      setActiveImage(item.image1);
      addToRecentlyViewed(id);
      fetchReviews();
      
      if (item.sizes?.length > 0) {
        setSelectedSize(item.sizes[0]);
      }
    }
  }, [id, products, addToRecentlyViewed, fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      promptAuth("Sign in to leave a review.");
      return;
    }

    if (!userComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await axios.post(`${serverUrl}/api/review/add`, {
        productId: id,
        rating: userRating,
        comment: userComment
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success({ title: "Review Submitted", message: "Thank you for your feedback!" });
        setUserComment("");
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const promptAuth = useCallback(
    (reason) => {
      toast.info({
        title: "Sign in to continue",
        message: reason,
        dedupeKey: `product:${id}:auth`,
        actions: [
          {
            label: "Sign in",
            variant: "primary",
            onClick: () => navigate("/login", { state: { from: location } }),
          },
          {
            label: "Create account",
            onClick: () => navigate("/signup", { state: { from: location } }),
          },
        ],
      });
    },
    [id, location, navigate, toast]
  );

  const handleAddToCart = async () => {
    if (!product || cartPending) return;
    
    if (!isLoggedIn) {
      promptAuth("Sign in to add items to your bag.");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setCartPending(true);
    await addToCart(id, selectedSize);
    setCartPending(false);
  };

  const handleStockNotify = async () => {
    if (!product || !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    const email = userData?.email || window.prompt("Enter your email to get notified when this size is back in stock:");
    if (!email) return;

    try {
      const response = await axios.post(`${serverUrl}/api/stock-alert/add`, {
        productId: product._id,
        size: selectedSize,
        email
      });
      if (response.data.success) {
        toast.success("Notification set! We'll email you when it's back.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set alert");
    }
  };

  const handleWishlistToggle = async () => {
    if (!product || wishlistPending) return;

    if (!isLoggedIn) {
      promptAuth("Save items to your wishlist.");
      return;
    }

    setWishlistPending(true);
    await toggleWishlist(product);
    setWishlistPending(false);
  };

  if (!product) return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
    </div>
  );

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  const stockMap = product.stock || {};
  const remainingStock = typeof stockMap === "number" ? stockMap : (stockMap[selectedSize] || 0);

  return (
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FiChevronRight />
          <Link to="/collection" className="hover:text-black transition-colors">Collection</Link>
          <FiChevronRight />
          <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[600px]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative shrink-0 w-20 md:w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-black shadow-lg" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-white rounded-[40px] overflow-hidden aspect-[3/4] shadow-[0_20px_80px_rgba(0,0,0,0.03)] border border-gray-100 group cursor-zoom-in">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-orange-400">
                {[1, 2, 3, 4, 5].map((s) => <FiStar key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-l border-gray-200 pl-3">
                4.8 Rating • 120 Reviews
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-950 mb-4">{product.name}</h1>
            
            <p className="text-2xl font-semibold text-gray-900 mb-8">{currency}{product.price}</p>
            
            <p className="text-gray-500 leading-relaxed mb-10 text-base">{product.description}</p>

            {/* SIZE SELECTION */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-950">Select Size</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-4">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[64px] h-[64px] rounded-2xl border-2 transition-all flex items-center justify-center text-sm font-medium ${selectedSize === size ? "border-black bg-black text-white shadow-xl scale-105" : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-4 mt-auto">
              <button
                type="button"
                disabled={cartPending || remainingStock <= 0}
                onClick={handleAddToCart}
                className={`w-full rounded-full py-5 uppercase tracking-[0.25em] text-xs font-bold transition shadow-2xl flex items-center justify-center gap-3 ${remainingStock <= 0 ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-black border-black text-white hover:bg-gray-800"}`}
              >
                {cartPending ? "Adding to Bag..." : remainingStock <= 0 ? "Out of Stock" : (
                  <>
                    <FiShoppingBag size={18} />
                    Add to Bag
                  </>
                )}
              </button>

              {remainingStock <= 0 && selectedSize && (
                <button
                  type="button"
                  onClick={handleStockNotify}
                  className="w-full rounded-full border border-black py-5 uppercase tracking-[0.25em] text-xs font-bold text-black transition hover:bg-black hover:text-white flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2"
                >
                  <FiBell size={18} />
                  Notify Me When Available
                </button>
              )}

              <button
                type="button"
                disabled={wishlistPending}
                onClick={handleWishlistToggle}
                className={`w-full rounded-full border py-5 uppercase tracking-[0.25em] text-xs font-bold transition flex items-center justify-center gap-3 ${wishlisted ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-900 hover:border-black"}`}
              >
                <FiHeart size={18} className={wishlisted ? "fill-current" : ""} />
                {wishlistPending ? "Updating..." : wishlisted ? "In Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><FiTruck /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><FiRefreshCw /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">30-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><FiShield /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Authenticity Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] w-12 bg-black" />
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-gray-950">You May Also <span className="italic">Like</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {recommendations.map((item) => (
                <Card 
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              ))}
            </div>
          </section>
        )}

        {/* REVIEWS SECTION */}
        <div className="mt-32 pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row gap-16">
            {/* RATING SUMMARY */}
            <div className="w-full md:w-[320px] shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-950 mb-8">Customer Reviews</h3>
              <div className="flex items-center gap-6 mb-8">
                <span className="text-7xl font-light text-gray-950">{reviewStats.averageRating || "0"}</span>
                <div className="flex flex-col gap-1">
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} size={18} fill={s <= Math.round(reviewStats.averageRating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Based on {reviewStats.totalReviews} Reviews</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-4 group cursor-help">
                      <span className="text-[10px] font-bold text-gray-400 w-2">{rating}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-gray-300 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS LIST & FORM */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                   {reviewLoading ? "Loading reviews..." : `Showing ${reviews.length} Latest Reviews`}
                 </p>
                 {!showReviewForm && (
                   <button 
                    onClick={() => setShowReviewForm(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-950 border-b border-black pb-1 hover:opacity-60 transition-opacity"
                   >
                     Write a Review
                   </button>
                 )}
              </div>

              {showReviewForm && (
                <div className="mb-16 p-8 bg-gray-50 rounded-[32px] border border-gray-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-8">
                      <h4 className="text-xl font-light">Share your experience</h4>
                      <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-black"><FiX size={20}/></button>
                   </div>
                   <form onSubmit={handleReviewSubmit}>
                      <div className="mb-8">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your Rating</p>
                         <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                               <button 
                                key={s} 
                                type="button"
                                onClick={() => setUserRating(s)}
                                className={`text-2xl transition-all ${s <= userRating ? "text-orange-400 scale-110" : "text-gray-200 hover:text-gray-300"}`}
                               >
                                  <FiStar fill={s <= userRating ? "currentColor" : "none"} />
                               </button>
                            ))}
                         </div>
                      </div>
                      <div className="mb-8">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your Thoughts</p>
                         <textarea 
                          rows="4" 
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="What did you like about this product? How is the fit and quality?"
                          className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                         />
                      </div>
                      <button 
                        type="submit" 
                        disabled={submittingReview}
                        className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {submittingReview ? "Submitting..." : "Post Review"}
                      </button>
                   </form>
                </div>
              )}

              <div className="flex flex-col gap-12">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review._id}
                    author={review.userName} 
                    date={new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                    rating={review.rating} 
                    content={review.comment}
                  />
                ))}
                
                {reviews.length === 0 && !reviewLoading && (
                  <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY ADD TO CART (MOBILE/SCROLL) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 transition-transform duration-500 ${showSticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <img src={product.image1} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{product.name}</p>
              <p className="text-xs text-gray-500">{currency}{product.price}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={cartPending || remainingStock <= 0}
            className="flex-1 sm:flex-none sm:min-w-[200px] bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition"
          >
            {cartPending ? "Adding..." : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ author, date, rating, content }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100 uppercase">{author.charAt(0)}</div>
          <div>
            <p className="text-sm font-semibold text-gray-950">{author}</p>
            <div className="flex text-orange-400 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <FiStar key={s} size={10} fill={s <= rating ? "currentColor" : "none"} />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{date}</span>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{content}</p>
    </div>
  );
}

export default ProductDetail;
