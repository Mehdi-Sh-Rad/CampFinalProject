'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || '';

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    const params = new URLSearchParams(window.location.search);

    if (selectedSort) {
      params.set('sort', selectedSort);
    } else {
      params.delete('sort');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-end mb-6">
      <select
        className="border border-gray-300 rounded-md p-2"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="">مرتب‌سازی پیشفرض</option>
        <option value="price-asc">ارزان‌ترین</option>
        <option value="price-desc">گران‌ترین</option>
        <option value="name-asc">نام (الف-ی)</option>
        <option value="name-desc">نام (ی-الف)</option>
      </select>
    </div>
  );
}
