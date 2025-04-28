"use client";

export default function ProductsSortSelect({ sort, onSortChange }) {
  return (
    <div className="mb-4 flex justify-end">
      <select
        value={sort || ""}
        onChange={(e) => onSortChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">مرتب‌سازی</option>
        <option value="price-asc">قیمت: ارزان‌ترین</option>
        <option value="price-desc">قیمت: گران‌ترین</option>
        <option value="name-asc">نام: الفبایی A-Z</option>
        <option value="name-desc">نام: الفبایی Z-A</option>
      </select>
    </div>
  );
}
