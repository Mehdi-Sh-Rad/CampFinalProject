"use client";
import { useState, useEffect } from "react";

const ProductsFilter = ({ onFilterChange, filters, onResetFilters }) => {
  // State for filter values, initialized from props
  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const [award, setAward] = useState(filters.award || false);
  const [free, setFree] = useState(filters.free || false);
  const [active, setActive] = useState(filters.active || false);
  const [discountPrice, setDiscountPrice] = useState(filters.discountPrice || false);

  // Update state when filters prop changes
  useEffect(() => {
    setMinPrice(filters.minPrice || "");
    setMaxPrice(filters.maxPrice || "");
    setAward(filters.award || false);
    setFree(filters.free || false);
    setActive(filters.active || false);
    setDiscountPrice(filters.discountPrice || false);
  }, [filters]);

  // Handle input changes
  const handleChange = (key, value) => {
    const updatedFilters = {
      minPrice,
      maxPrice,
      award,
      free,
      active,
      discountPrice,
      [key]: value,
    };

    // Update the filter state
    if (key === "minPrice") setMinPrice(value);
    if (key === "maxPrice") setMaxPrice(value);
    if (key === "award") setAward(value);
    if (key === "free") setFree(value);
    if (key === "active") setActive(value);
    if (key === "discountPrice") setDiscountPrice(value);

    // Remove null/undefined filters before sending to parent
    const cleanFilters = {};
    for (const filterKey in updatedFilters) {
      if (updatedFilters[filterKey] !== null && updatedFilters[filterKey] !== undefined) {
        cleanFilters[filterKey] = updatedFilters[filterKey];
      }
    }
    // Notify parent component of filter changes
    onFilterChange(cleanFilters);
  };

  return (
    <div className="w-full bg-white p-4 rounded-2xl shadow-md flex flex-wrap gap-6 justify-between">
      <div className="flex-1 min-w-[120px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">حداقل قیمت:</label>
        <input
          type="number"
          min="0"
          max="1000000000"
          value={minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value ? parseInt(e.target.value) : "")}
          placeholder="تومان"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">حداکثر قیمت:</label>
        <input
          type="number"
          min="0"
          max="1000000000"
          value={maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value ? parseInt(e.target.value) : "")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="تومان"
        />
      </div>

      <div className="flex items-center gap-x-2">
        <input
          id="award"
          type="checkbox"
          className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          checked={award}
          onChange={(e) => handleChange("award", e.target.checked)}
        />
        <label htmlFor="award" className="text-sm text-gray-700">محصولات دارای جایزه</label>
      </div>

      <div className="flex items-center gap-x-2">
        <input
          id="active"
          type="checkbox"
          className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          checked={active}
          onChange={(e) => handleChange("active", e.target.checked)}
        />
        <label htmlFor="active" className="text-sm text-gray-700">فقط محصولات موجود</label>
      </div>

      <div className="flex items-center gap-x-2">
        <input
          id="free"
          type="checkbox"
          className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          checked={free}
          onChange={(e) => handleChange("free", e.target.checked)}
        />
        <label htmlFor="free" className="text-sm text-gray-700">محصولات رایگان</label>
      </div>

      <div className="flex items-center gap-x-2">
        <input
          id="discountPrice"
          type="checkbox"
          className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          checked={discountPrice}
          onChange={(e) => handleChange("discountPrice", e.target.checked)}
        />
        <label htmlFor="discountPrice" className="text-sm text-gray-700">محصولات دارای تخفیف</label>
      </div>

      
    </div>
  );
};

export default ProductsFilter;