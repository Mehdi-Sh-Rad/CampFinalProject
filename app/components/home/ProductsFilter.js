"use client";
import { useState } from "react";

const ProductsFilter = ({ onFilterChange }) => {
  // State for filter values
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    award: false,
    free: false,
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
    <div className="filters flex items-center gap-x-4 w-full justify-evenly">
      <div className="">
        <label>حداقل قیمت:</label>
        <input
          type="number"
          min="0"
          max="1000000000"
          value={filters.minPrice || ""}
          onChange={(e) => handleChange("minPrice", e.target.value ? parseInt(e.target.value) : null)}
          className="border rounded p-1 w-full"
        />
      </div>

      <div>
        <label>حداکثر قیمت:</label>
        <input
          type="number"
          min="0"
          max="1000000000"
          value={filters.maxPrice || ""}
          onChange={(e) => handleChange("maxPrice", e.target.value ? parseInt(e.target.value) : null)}
          className="border rounded p-1 w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={filters.award} onChange={(e) => handleChange("award", e.target.checked)} />
        <label>محصولات دارای جایزه</label>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={filters.free} onChange={(e) => handleChange("free", e.target.checked)} />
        <label>محصولات رایگان</label>
      </div>
    </div>
  );
};

export default ProductsFilter;
