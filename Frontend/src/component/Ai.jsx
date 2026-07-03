import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FiX, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { authDataContext } from "../Context/AuthContext";
import { shopDataContext } from "../Context/ShopContext";

const INITIAL_PROMPTS = [
  "Show me best sellers",
  "Find black hoodies under ₹1500",
  "What's new for women?",
  "Recommend something for the gym",
];

const EMPTY_COLLECTIONS = { topProducts: [], recommendationProducts: [], relatedProducts: [] };

/**
 * OneCart Personal Shopping Concierge
 * — Floating pill trigger at bottom-center
 * — Right-side panel on dark background
 * — Clean message display (no bubble borders)
 * — Product cards: image + name/price, minimal
 */
function Ai() {
  const { serverUrl }   = useContext(authDataContext);
  const { currency }    = useContext(shopDataContext);
  const navigate        = useNavigate();
  const scrollRef       = useRef(null);
  const inputRef        = useRef(null);

  const [open,     setOpen]     = useState(false);
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [typing,   setTyping]   = useState(false);
  const [error,    setError]    = useState("");
  const [messages, setMessages] = useState([]);

  const canSubmit = query.trim().length > 0 && !loading;

  /* ---- conversation history for context ---- */
  const conversationHistory = useMemo(
    () => messages
      .filter(m => !m.isError)
      .map(m => ({
        role:    m.role,
        content: m.role === "user" ? m.question : m.answer,
      })),
    [messages]
  );

  const historyWithQuery = useCallback(
    text => [...conversationHistory, { role: "user", content: text }],
    [conversationHistory]
  );

  /* ---- auto focus on open ---- */
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  /* ---- auto scroll ---- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  /* ---- lock body scroll when open on mobile ---- */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const normalizeProduct = p => ({
    id:          p?.id || p?._id || "",
    name:        p?.name || "Untitled",
    description: p?.description || "",
    category:    p?.category || "",
    subCategory: p?.subCategory || "",
    brand:       p?.brand || "",
    price:       p?.price ?? null,
    image:       p?.image || p?.image1 || p?.imageUrl || p?.images?.[0] || "",
    score:       p?.score ?? null,
  });

  const sendQuery = useCallback(async value => {
    const text = String(value || query).trim();
    if (!text || loading) return;

    setError("");
    setLoading(true);
    setTyping(true);
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: "user", question: text }]);
    setQuery("");

    try {
      const res = await axios.post(`${serverUrl}/api/ai/chat`, {
        query:    text,
        limit:    4,
        messages: historyWithQuery(text),
      });

      const payload     = res.data?.data || {};
      const suggestions = res.data?.suggestions || payload.suggestions || [];

      setMessages(prev => [...prev, {
        id:                  `ai-${Date.now()}`,
        role:                "assistant",
        answer:              res.data?.message || payload.answer || "",
        intent:              payload.intent || "search",
        filtersApplied:      payload.filtersApplied || {},
        topProducts:         (Array.isArray(res.data?.products) ? res.data.products : Array.isArray(payload.topProducts) ? payload.topProducts : []).map(normalizeProduct),
        recommendationProducts: (Array.isArray(payload.recommendationProducts) ? payload.recommendationProducts : []).map(normalizeProduct),
        relatedProducts:     (Array.isArray(payload.relatedProducts) ? payload.relatedProducts : []).map(normalizeProduct),
        confidence:          payload.confidence ?? null,
        suggestions,
      }]);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "Request failed.";
      setError(msg);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`, role: "assistant", answer: "",
        intent: "conversation", filtersApplied: {}, ...EMPTY_COLLECTIONS,
        confidence: null, isError: true, errorMessage: msg,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => setTyping(false), 300);
    }
  }, [historyWithQuery, loading, query, serverUrl]);

  const handleSubmit = e => { e.preventDefault(); sendQuery(query); };

  const handleRetry = useCallback(() => {
    const userMessages = messages.filter(m => m.role === "user");
    if (!userMessages.length) return;
    const lastQuery = userMessages[userMessages.length - 1].question;
    setMessages(prev => prev.filter(m => !m.isError));
    setError("");
    sendQuery(lastQuery);
  }, [messages, sendQuery]);

  const latestSuggestions = useMemo(() => {
    const ais = messages.filter(m => m.role === "assistant" && !m.isError);
    if (!ais.length) return [];
    return ais[ais.length - 1].suggestions || [];
  }, [messages]);

  const openProduct = id => {
    if (id) { navigate(`/productdetail/${id}`); setOpen(false); }
  };

  const activePrompts = latestSuggestions.length > 0 ? latestSuggestions : INITIAL_PROMPTS;

  return (
    <>
      {/* ── FLOATING PILL TRIGGER ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-[30] md:z-[9998] flex items-center gap-2.5 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 border ${
          open
            ? "bg-white text-[var(--ink)] border-[var(--border-md)] shadow-lg"
            : "bg-[var(--ink)] text-white border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:bg-[var(--ink-80)]"
        }`}
        aria-label="Toggle AI shopping assistant"
      >
        {open ? (
          <><FiX size={13} /> Close</>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
            Personal Shopping
          </>
        )}
      </button>

      {/* ── PANEL ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 z-[9997] flex flex-col bg-[#0A0A0A] text-white"
            style={{ width: "min(420px, 100vw)" }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 shrink-0">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.35em] text-white/30">OneCart</p>
                <p className="text-[13px] font-medium mt-0.5 text-white">Personal Shopping</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white transition-colors p-1"
                aria-label="Close shopping assistant"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6"
            >
              {/* empty state */}
              {messages.length === 0 && !typing && (
                <div className="py-10">
                  <p className="text-[20px] font-display font-light italic text-white/60 leading-snug mb-8">
                    What are you<br />looking for today?
                  </p>
                  <div className="space-y-2">
                    {INITIAL_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => sendQuery(p)}
                        className="block text-[12px] text-white/40 hover:text-white transition-colors text-left underline-offset-2 hover:underline"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* message list */}
              {messages.map(msg => (
                <MessageRow
                  key={msg.id}
                  message={msg}
                  currency={currency || "₹"}
                  onProductClick={openProduct}
                  onRetry={handleRetry}
                />
              ))}

              {/* typing indicator */}
              {typing && (
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.15 }}
                      className="h-1.5 w-1.5 rounded-full bg-white/40"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* suggestions + input */}
            <div className="shrink-0 border-t border-white/8 px-6 py-5">
              {/* quick prompts */}
              {activePrompts.slice(0, 3).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activePrompts.slice(0, 3).map(p => (
                    <button
                      key={p}
                      onClick={() => sendQuery(p)}
                      className="text-[10px] text-white/40 hover:text-white transition-colors underline-offset-2 hover:underline"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* form */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-white/20 pb-3 focus-within:border-white/40 transition-colors">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask anything about our collection..."
                  className="flex-1 bg-transparent outline-none text-[13px] font-light text-white placeholder:text-white/25"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="text-white/40 hover:text-white transition-colors disabled:opacity-20"
                  aria-label="Send"
                >
                  <FiArrowRight size={17} />
                </button>
              </form>

              {error && <p className="mt-3 text-[11px] text-red-400">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Message Row ── */
function MessageRow({ message, currency, onProductClick, onRetry }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="text-[12px] font-medium text-white/80 max-w-[80%] text-right">{message.question}</p>
      </div>
    );
  }

  if (message.isError) {
    return (
      <div className="space-y-2">
        <p className="text-[12px] text-red-400/80 font-light">{message.errorMessage || "Something went wrong."}</p>
        <button
          onClick={onRetry}
          className="text-[10px] uppercase tracking-[0.15em] text-white/30 hover:text-white transition-colors"
        >
          Retry →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI text */}
      {message.answer && (
        <p className="text-[13px] font-light leading-relaxed text-white/75 whitespace-pre-line">
          {message.answer}
        </p>
      )}

      {/* Products */}
      <ProductList label="Matches" products={message.topProducts}            currency={currency} onProductClick={onProductClick} />
      <ProductList label="For You" products={message.recommendationProducts} currency={currency} onProductClick={onProductClick} />
      <ProductList label="Related" products={message.relatedProducts}        currency={currency} onProductClick={onProductClick} />

      {/* Filters applied */}
      {message.filtersApplied && Object.keys(message.filtersApplied).length > 0 && (
        <p className="text-[10px] text-white/25 font-light">{formatFilters(message.filtersApplied, currency)}</p>
      )}
    </div>
  );
}

function ProductList({ label, products, currency, onProductClick }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/25">{label}</p>
      <div className="space-y-2">
        {products.map(p => (
          <AiProductCard key={p.id || p.name} product={p} currency={currency} onClick={() => onProductClick(p.id)} />
        ))}
      </div>
    </div>
  );
}

function AiProductCard({ product, currency, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-2.5 border-b border-white/6 hover:border-white/15 transition-colors text-left group"
    >
      {/* image */}
      <div className="w-10 h-12 shrink-0 overflow-hidden bg-white/5">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-white/20 text-[8px] uppercase tracking-widest">No image</div>
        }
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-light text-white truncate">{product.name}</p>
        {product.category && (
          <p className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">{product.category}</p>
        )}
      </div>

      {/* price + arrow */}
      <div className="shrink-0 text-right">
        <p className="text-[12px] font-medium text-white">
          {product.price != null ? `${currency}${product.price}` : "—"}
        </p>
        <FiArrowRight size={12} className="text-white/20 group-hover:text-white/60 transition-colors ml-auto mt-1" />
      </div>
    </button>
  );
}

function formatFilters(filters, currency) {
  const parts = [];
  if (filters.category)    parts.push(`Category: ${filters.category}`);
  if (filters.subCategory) parts.push(`Type: ${filters.subCategory}`);
  if (filters.brand)       parts.push(`Brand: ${filters.brand}`);
  if (filters.minBudget != null || filters.maxBudget != null) {
    const min = filters.minBudget != null ? `${currency}${filters.minBudget}` : "";
    const max = filters.maxBudget != null ? `${currency}${filters.maxBudget}` : "";
    parts.push(`Budget: ${[min, max].filter(Boolean).join("–")}`);
  }
  return parts.join(" · ");
}

export default Ai;
