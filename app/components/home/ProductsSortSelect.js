"use client";

export default function ProductsSortSelect({ sort, onSortChange }) {
  return (
    <div className="mb-4 flex justify-end">
      <select value={sort || ""} onChange={(e) => onSortChange(e.target.value)} className="border rounded p-2">
        <option value="">مرتب‌سازی</option>
        <option value="price-asc">ارزان‌ترین</option>
        <option value="price-desc">گران‌ترین</option>
        <option value="sold-asc">کم فروش‌ترین</option>
        <option value="sold-desc">پر فروش‌ترین</option>
        <option value="name-asc">نام A-Z</option>
        <option value="name-desc">نام Z-A</option>
        
      </select>
    </div>
  );
}
