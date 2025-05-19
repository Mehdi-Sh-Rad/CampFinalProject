"use client";

export default function ProductsSortSelect({ sort, onSortChange, isFreeFilterActive }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex justify-end">
      <label htmlFor="sort" className="sr-only">
        مرتب‌سازی
      </label>
      <select
        id="sort"
        value={sort || ""}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">مرتب‌سازی</option>
        <option value="price-asc" disabled={isFreeFilterActive}>ارزان‌ترین</option>
        <option value="price-desc" disabled={isFreeFilterActive}>گران‌ترین</option>
        <option value="sold-asc">کم فروش‌ترین</option>
        <option value="sold-desc">پر فروش‌ترین</option>
        <option value="view-asc">کم بازدیدترین</option>
        <option value="view-desc">پر بازدیدترین</option>
        <option value="name-asc">نام A-Z</option>
        <option value="name-desc">نام Z-A</option>
      </select>
    </div>
  );
}
