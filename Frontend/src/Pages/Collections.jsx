import React, { useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { shopDataContext } from "../Context/ShopContext";
import Card from "../component/Card";
import Skeleton from "../component/Skeleton";
import OurPolicy from "../component/OurPolicy";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

import catMen from "../assets/cat_men.jpg";
import catWomen from "../assets/cat_women.jpg";
import catKids from "../assets/cat_kids.jpg";
import heroStreet from "../assets/hero_women_street.jpg";

const CATEGORIES     = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["TopWear", "BottomWear", "WinterWear"];
const SORT_OPTIONS   = [
  { value: "featured", label: "Featured" },
  { value: "low",      label: "Price: Low to High" },
  { value: "high",     label: "Price: High to Low" },
  { value: "newest",   label: "Newest" },
];

export default function Collections() {
  const { products, search, showSearch, productsLoading } = useContext(shopDataContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Read filters from URL params on mount ──
  const paramCategory    = searchParams.get("category");
  const paramSubCategory = searchParams.get("subcategory");

  const [selectedCategory,    setSelectedCategory]    = useState(() => paramCategory    ? [paramCategory]    : []);
  const [selectedSubCategory, setSelectedSubCategory] = useState(() => paramSubCategory ? [paramSubCategory] : []);
  const [priceMax,            setPriceMax]            = useState(40000);
  const [sort,                setSort]                = useState("featured");
  const [filtered,            setFiltered]            = useState([]);
  const [showMobileFilter,    setShowMobileFilter]    = useState(false);

  // ── Sync URL → state when URL changes externally (e.g. from nav links) ──
  useEffect(() => {
    const c = searchParams.get("category");
    const s = searchParams.get("subcategory");
    setSelectedCategory(c ? [c] : []);
    setSelectedSubCategory(s ? [s] : []);
  }, [searchParams]);

  const toggleFilter = useCallback((value, setter, current) => {
    setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  }, []);

  const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setPriceMax(40000);
    setSort("featured");
    setSearchParams({});
  };

  const hasFilters = selectedCategory.length > 0 || selectedSubCategory.length > 0 || priceMax < 40000;

  // ── Filter + sort ──
  useEffect(() => {
    let temp = [...products];

    // Search override
    if (showSearch && search.trim()) {
      temp = temp.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category (AND logic between cat and subcat)
    if (selectedCategory.length)    temp = temp.filter(p => selectedCategory.includes(p.category));
    if (selectedSubCategory.length) temp = temp.filter(p => selectedSubCategory.includes(p.subCategory));

    // Price ceiling
    temp = temp.filter(p => p.price <= priceMax);

    // Sort
    if (sort === "low")    temp = [...temp].sort((a, b) => a.price - b.price);
    if (sort === "high")   temp = [...temp].sort((a, b) => b.price - a.price);
    if (sort === "newest") temp = [...temp].reverse();

    setFiltered(temp);
  }, [selectedCategory, selectedSubCategory, priceMax, sort, products, search, showSearch]);

  // ── Dynamic lookbook banner content ──
  const getBannerDetails = () => {
    if (showSearch && search.trim()) {
      return {
        title: "Search Results",
        subtitle: `Query: "${search}"`,
        description: `Browse matching results for your query. Use the filters on the left to refine by department, category, or price.`,
        image: heroStreet,
      };
    }
    const cat = selectedCategory[0];
    if (cat === "Men") {
      return {
        title: "Functional Tailoring",
        subtitle: "Men's Collection",
        description: "A study in structure and utility. Natural linen shirts, lightweight tailoring, and relaxed trousers designed for ease of movement.",
        image: catMen,
      };
    }
    if (cat === "Women") {
      return {
        title: "Serene Silhouettes",
        subtitle: "Women's Collection",
        description: "Soft shapes in organic fabrics. From flowing linen dresses to oversized outerwear, built with clean profiles and delicate details.",
        image: catWomen,
      };
    }
    if (cat === "Kids") {
      return {
        title: "Conscious Playwear",
        subtitle: "Kids' Collection",
        description: "Comfort, resilience, and simplicity. Crafted with super soft organic cotton and details that accommodate play.",
        image: catKids,
      };
    }
    return {
      title: "The Core Anthology",
      subtitle: "All Collections",
      description: "Our complete list of timeless staples. Neutral palettes, elevated cuts, and deliberate craftsmanship for every department.",
      image: heroStreet,
    };
  };

  const banner = getBannerDetails();

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ paddingTop: "var(--nav-height)" }}>

      {/* ── LOOKBOOK BANNER ── */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-0">
          {/* Left panel: Info */}
          <div className="px-6 md:px-10 lg:px-16 py-16 md:py-24 flex flex-col justify-center space-y-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--ink-40)]">
              {banner.subtitle}
            </p>
            <h1 className="font-display font-light leading-[1.1] tracking-tight text-[var(--ink)]"
                style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
              {banner.title}
            </h1>
            <p className="text-[13px] font-light leading-relaxed text-[var(--ink-60)] max-w-md">
              {banner.description}
            </p>
          </div>
          {/* Right panel: Image */}
          <div className="aspect-[16/10] lg:aspect-auto lg:h-[450px] overflow-hidden bg-[#EEECEA] border-t lg:border-t-0 lg:border-l border-[var(--border)]">
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ── FILTER META BAR ── */}
      <div className="border-b border-[var(--border)] px-6 md:px-10 lg:px-16 py-6 bg-[var(--cream)]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] hover:border-[var(--ink-60)] transition-colors"
              >
                Reset All Filters
              </button>
            )}
            <p className="text-[12px] font-medium text-[var(--ink-40)]">{filtered.length} piece{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* ── CATEGORY QUICK NAV ── */}
        <div className="max-w-[1440px] mx-auto mt-5 flex flex-wrap gap-2">
          <button
            onClick={resetFilters}
            className={`text-[10px] font-medium uppercase tracking-[0.15em] px-3.5 py-1.5 border transition-colors ${
              !hasFilters ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "border-[var(--border-md)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory([cat]);
                setSelectedSubCategory([]);
                setSearchParams({ category: cat });
              }}
              className={`text-[10px] font-medium uppercase tracking-[0.15em] px-3.5 py-1.5 border transition-colors ${
                selectedCategory.length === 1 && selectedCategory[0] === cat && selectedSubCategory.length === 0
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                  : "border-[var(--border-md)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
          {SUB_CATEGORIES.map(sub => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubCategory([sub]);
                setSelectedCategory([]);
                setSearchParams({ subcategory: sub });
              }}
              className={`text-[10px] font-medium uppercase tracking-[0.15em] px-3.5 py-1.5 border transition-colors ${
                selectedSubCategory.length === 1 && selectedSubCategory[0] === sub && selectedCategory.length === 0
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                  : "border-[var(--border-md)] text-[var(--ink-60)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-10">
        <div className="flex gap-12 lg:gap-16">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden md:block w-44 shrink-0">
            <div className="sticky space-y-10" style={{ top: "calc(var(--nav-height) + 24px)" }}>

              {/* Sort */}
              <SidebarSection title="Sort by">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`block text-left text-[12px] w-full transition-colors ${
                      sort === opt.value ? "text-[var(--ink)] font-medium" : "text-[var(--ink-40)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </SidebarSection>

              <div className="h-px bg-[var(--border)]" />

              {/* Price */}
              <SidebarSection title="Max Price">
                <input
                  type="range" min={0} max={40000} step={500}
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  aria-label="Maximum price"
                />
                <div className="flex justify-between text-[10px] text-[var(--ink-40)] mt-1">
                  <span>₹0</span>
                  <span className="text-[var(--ink)] font-medium">₹{priceMax.toLocaleString("en-IN")}</span>
                </div>
              </SidebarSection>

              <div className="h-px bg-[var(--border)]" />

              {/* Departments */}
              <FilterGroup
                title="Department"
                items={CATEGORIES}
                selected={selectedCategory}
                onToggle={v => toggleFilter(v, setSelectedCategory, selectedCategory)}
              />

              <div className="h-px bg-[var(--border)]" />

              <FilterGroup
                title="Type"
                items={SUB_CATEGORIES}
                selected={selectedSubCategory}
                onToggle={v => toggleFilter(v, setSelectedSubCategory, selectedSubCategory)}
              />
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <main className="flex-1 min-w-0">
            {/* Mobile filter row */}
            <div className="md:hidden flex items-center justify-between mb-7">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink)] border-b border-[var(--ink)] pb-0.5"
              >
                <FiFilter size={12} />
                Filter{hasFilters ? ` (${selectedCategory.length + selectedSubCategory.length + (priceMax < 40000 ? 1 : 0)})` : ""}
              </button>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-[11px] bg-transparent outline-none text-[var(--ink)] font-medium cursor-pointer"
                aria-label="Sort"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12">
                {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} type="card" />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12">
                {filtered.map(item => (
                  <Card
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    image={item.image1}
                    hoverImage={item.image2}
                    price={item.price}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-[var(--ink)]/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[var(--cream)] border-l border-[var(--border)] flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Filter & Sort</p>
              <button onClick={() => setShowMobileFilter(false)} className="text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
              <SidebarSection title="Sort by">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSort(opt.value)}
                    className={`block text-left text-[13px] w-full py-1 ${sort === opt.value ? "text-[var(--ink)] font-medium" : "text-[var(--ink-40)]"}`}>
                    {opt.label}
                  </button>
                ))}
              </SidebarSection>

              <SidebarSection title="Max Price">
                <input type="range" min={0} max={40000} step={500} value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))} className="w-full cursor-pointer" />
                <p className="text-[12px] text-[var(--ink-60)] mt-1">Up to ₹{priceMax.toLocaleString("en-IN")}</p>
              </SidebarSection>

              <FilterGroup title="Department" items={CATEGORIES} selected={selectedCategory}
                onToggle={v => toggleFilter(v, setSelectedCategory, selectedCategory)} />

              <FilterGroup title="Type" items={SUB_CATEGORIES} selected={selectedSubCategory}
                onToggle={v => toggleFilter(v, setSelectedSubCategory, selectedSubCategory)} />
            </div>

            {/* footer */}
            <div className="px-6 py-5 border-t border-[var(--border)] flex gap-3">
              <button onClick={() => { resetFilters(); setShowMobileFilter(false); }}
                className="flex-1 py-3 border border-[var(--border-md)] text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors">
                Reset
              </button>
              <button onClick={() => setShowMobileFilter(false)}
                className="flex-1 py-3 bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-[0.15em] hover:bg-[var(--ink-80)] transition-colors">
                View {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <OurPolicy />
    </div>
  );
}

/* ── Helper components ── */

function SidebarSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)]">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterGroup({ title, items, selected, onToggle }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-4"
        aria-expanded={open}
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-40)]">{title}</p>
        {open ? <FiChevronUp size={11} className="text-[var(--ink-40)]" /> : <FiChevronDown size={11} className="text-[var(--ink-40)]" />}
      </button>
      {open && (
        <div className="space-y-3">
          {items.map(item => {
            const active = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className="flex items-center gap-3 text-left w-full group/item"
                aria-pressed={active}
              >
                <div className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 transition-colors ${
                  active ? "bg-[var(--ink)] border-[var(--ink)]" : "border-[var(--border-md)] group-hover/item:border-[var(--ink-40)]"
                }`}>
                  {active && <div className="w-1.5 h-1.5 bg-white" />}
                </div>
                <span className={`text-[12px] transition-colors ${
                  active ? "text-[var(--ink)] font-medium" : "text-[var(--ink-60)] group-hover/item:text-[var(--ink)]"
                }`}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <p className="font-display font-light text-[var(--ink)] mb-3" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
        No results.
      </p>
      <p className="text-[13px] font-light text-[var(--ink-40)] mb-8 max-w-[38ch] leading-relaxed">
        {hasFilters
          ? "No products match your current filters. Try adjusting or clearing them."
          : "No products available right now. Check back soon."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--ink-60)] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
