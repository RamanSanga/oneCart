import React, { useContext, useEffect, useState } from "react";
import { shopDataContext } from "../Context/ShopContext";
import Card from "../component/Card";
import { FiFilter, FiX } from "react-icons/fi";

function Collection() {
  const { products, search, showSearch } = useContext(shopDataContext);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [sort, setSort] = useState("featured");
  const [filtered, setFiltered] = useState(products);
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

    // SORT
    if (sort === "low") temp.sort((a, b) => a.price - b.price);
    if (sort === "high") temp.sort((a, b) => b.price - a.price);

    setFiltered(temp);
  }, [
    selectedCategory,
    selectedSubCategory,
    sort,
    products,
    search,
    showSearch,
  ]);

  return (
    <div className="pt-[110px] max-w-[1400px] mx-auto px-4 md:px-6">
      {/* TOP BAR (MOBILE) */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 text-sm border px-4 py-2"
        >
          <FiFilter /> Filters
        </button>

        <select
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-16">
        {/* DESKTOP FILTERS */}
        <aside className="hidden md:block w-[260px] shrink-0">
          <h3 className="font-medium mb-6">Filters</h3>

          <FilterBlock
            title="Category"
            items={["Men", "Women", "Kids"]}
            selected={selectedCategory}
            toggle={(v) => toggle(v, setSelectedCategory)}
          />

          <FilterBlock
            title="Type"
            items={["TopWear", "BottomWear", "WinterWear"]}
            selected={selectedSubCategory}
            toggle={(v) => toggle(v, setSelectedSubCategory)}
          />
        </aside>

        {/* PRODUCTS */}
        <section className="flex-1">
          {/* SORT BAR (DESKTOP) */}
          <div className="hidden md:flex justify-between items-center mb-10">
            <p className="text-sm text-gray-500">
              {filtered.length} products
            </p>

            <select
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
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
        </section>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute left-0 top-0 h-full w-[80%] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}>
                <FiX size={20} />
              </button>
            </div>

            <FilterBlock
              title="Category"
              items={["Men", "Women", "Kids"]}
              selected={selectedCategory}
              toggle={(v) => toggle(v, setSelectedCategory)}
            />

            <FilterBlock
              title="Type"
              items={["TopWear", "BottomWear", "WinterWear"]}
              selected={selectedSubCategory}
              toggle={(v) => toggle(v, setSelectedSubCategory)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Collection;

function FilterBlock({ title, items, selected, toggle }) {
  return (
    <div className="mb-10">
      <p className="text-sm font-medium mb-4">{title}</p>

      {items.map((item) => (
        <label
          key={item}
          className="flex items-center gap-3 mb-3 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggle(item)}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
