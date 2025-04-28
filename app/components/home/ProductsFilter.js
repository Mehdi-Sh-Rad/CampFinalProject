"use client";
import { useState } from "react";

const ProductsFilter = ({ onFilterChange }) => {
  // State for filter values
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    award: false,
    free: false,
    active: false,
  });

  // Handle input changes
  const handleChange = (key, value) => {
    // Update the filter state
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    // Remove null/undefined filters before sending to parent
    const cleanFilters = {};
    for (const key in updatedFilters) {
      if (updatedFilters[key] !== null && updatedFilters[key] !== undefined) {
        cleanFilters[key] = updatedFilters[key];
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
          value={filters.minPrice || ""}
          onChange={(e) => handleChange("minPrice", e.target.value ? parseInt(e.target.value) : null)}
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
          value={filters.maxPrice || ""}
          onChange={(e) => handleChange("maxPrice", e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="تومان"
        />
      </div>

      <div className="flex items-center gap-x-2">
        <input
        id="award"
          type="checkbox"
          className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          checked={filters.award}
          onChange={(e) => handleChange("award", e.target.checked)}
        />
        <label htmlFor="award" className="text-sm text-gray-700">محصولات دارای جایزه</label>
      </div>

      <div className="flex items-center gap-x-2">
        <input id="active" type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary" checked={filters.active} onChange={(e) => handleChange("active", e.target.checked)} />
        <label htmlFor="active" className="text-sm text-gray-700">فقط محصولات موجود</label>
      </div>

      <div className="flex items-center gap-x-2">
        <input type="checkbox" className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary" checked={filters.free} onChange={(e) => handleChange("free", e.target.checked)} />
        <label htmlFor="free" className="text-sm text-gray-700">محصولات رایگان</label>
      </div>
    </div>
  );
};

export default ProductsFilter;
