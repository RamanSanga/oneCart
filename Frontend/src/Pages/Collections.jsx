import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import Card from "../component/Card";
import { FiFilter, FiX, FiChevronDown, FiPlus, FiMinus } from "react-icons/fi";
import Skeleton from "../component/Skeleton";

function Collection() {
  const { products, search, showSearch, productsLoading } = useContext(shopDataContext);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]); // Default range
  const [sort, setSort] = useState("featured");
  const [filtered, setFiltered] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const toggle = (value, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    let temp = [...products];

    // SEARCH FIRST
    if (showSearch && search.trim() !== "") {
      temp = temp.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // CATEGORY
    if (selectedCategory.length) {
      temp = temp.filter((p) =>
        selectedCategory.includes(p.category)
      );
    }

    // SUB CATEGORY
    if (selectedSubCategory.length) {
      temp = temp.filter((p) =>
        selectedSubCategory.includes(p.subCategory)
      );
    }

    // PRICE RANGE
    temp = temp.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // SORT
    if (sort === "low") temp.sort((a, b) => a.price - b.price);
    if (sort === "high") temp.sort((a, b) => b.price - a.price);

    setFiltered(temp);
  }, [selectedCategory, selectedSubCategory, priceRange, sort, products, search, showSearch]);

  return (
    <div className="pt-[140px] pb-32 bg-[#05060a] min-h-screen text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/10" />
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">Curated <span className="italic text-white/75">Collections</span></h1>
          </div>
          
          <div className="flex items-center gap-4 self-end">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sort By</p>
            <div className="relative group">
               <select
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white/5 text-white border border-white/10 rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-white/10 transition-all cursor-pointer min-w-[180px]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
          {/* DESKTOP FILTERS */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white mb-8 border-b border-white/10 pb-4">Refine Results</h3>
                
                {/* PRICE RANGE FILTER */}
                <div className="mb-10">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Price Range</p>
                   <input 
                    type="range" 
                    min="0" 
                    max="40000" 
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-yellow-300 mb-4 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    aria-label="Maximum price"
                   />
                   <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>₹0</span>
                      <span className="text-black bg-yellow-300 px-3 py-1 rounded-full border border-white/10 shadow-sm">Up to ₹{priceRange[1]}</span>
                   </div>
                </div>

                <FilterBlock
                  title="Department"
                  items={["Men", "Women", "Kids"]}
                  selected={selectedCategory}
                  toggle={(v) => toggle(v, setSelectedCategory)}
                />

                <FilterBlock
                  title="Product Type"
                  items={["TopWear", "BottomWear", "WinterWear"]}
                  selected={selectedSubCategory}
                  toggle={(v) => toggle(v, setSelectedSubCategory)}
                />
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Selected Items</p>
                <p className="text-2xl font-light text-white">{filtered.length}</p>
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <section className="flex-1">
             {/* MOBILE FILTER TRIGGER */}
             <button
              onClick={() => setShowMobileFilter(true)}
              className="md:hidden w-full flex items-center justify-between px-8 py-4 bg-white/5 border border-white/10 rounded-2xl mb-8 shadow-sm text-white"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <FiFilter /> Filters
              </span>
              <span className="text-[10px] font-bold text-white/40">{filtered.length} Items</span>
            </button>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <Skeleton key={n} type="card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white/5 rounded-[40px] py-32 text-center border border-white/10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/30">
                    <FiX size={32} />
                 </div>
                  <h2 className="text-2xl font-light text-white mb-2">No products found</h2>
                  <p className="text-white/50 text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {filtered.map((item) => (
                  <Card
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    image={item.image1}
                    hoverImage={item.image2}
                    price={item.price}
                    isBestSeller={item.bestSeller}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MOBILE FILTER SIDEBAR */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#05060a] p-8 overflow-y-auto animate-in slide-in-from-right duration-300 text-white border-l border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-light">Filter Results</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 -mr-2"><FiX size={24} /></button>
            </div>

            {/* PRICE RANGE FILTER */}
            <div className="mb-12">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Price Range</p>
                <input 
                type="range" 
                min="0" 
                max="40000" 
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-yellow-300 mb-4 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                aria-label="Maximum price mobile"
                />
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>₹0</span>
                    <span className="text-black bg-yellow-300 px-3 py-1 rounded-full border border-white/10 shadow-sm">Up to ₹{priceRange[1]}</span>
                </div>
            </div>

            <FilterBlock
              title="Department"
              items={["Men", "Women", "Kids"]}
              selected={selectedCategory}
              toggle={(v) => toggle(v, setSelectedCategory)}
            />

            <FilterBlock
              title="Product Type"
              items={["TopWear", "BottomWear", "WinterWear"]}
              selected={selectedSubCategory}
              toggle={(v) => toggle(v, setSelectedSubCategory)}
            />

            <button 
              onClick={() => setShowMobileFilter(false)}
              className="w-full bg-white text-black py-5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-10"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBlock({ title, items, selected, toggle }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-10 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-6 transition-colors"
        aria-expanded={isOpen}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-white">{title}</p>
        {isOpen ? <FiMinus size={14} className="text-white/60" /> : <FiPlus size={14} className="text-white/60" />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          {items.map((item) => {
            const isActive = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className="flex items-center gap-4 text-sm group/item"
                aria-pressed={isActive}
              >
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${isActive ? "bg-white text-black border-white shadow-lg" : "border-white/10 bg-transparent group-hover/item:border-white/20"}`}>
                  {isActive && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
                <span className={`transition-colors ${isActive ? "text-white font-medium" : "text-white/60 group-hover/item:text-white"}`}>{item}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Collection;
