export default function Benefits() {
  return (
    <section className="text-center p-4 md:p-8 bg-background my-12">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-dark">چرا از بوکینو خرید کنیم؟</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h4 className="font-bold text-dark text-sm">دسترسی فوری</h4>
          <p className="text-dark text-sm">بلافاصله پس از خرید دانلود کنید</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h4 className="font-bold text-dark text-sm">دسترسی همیشگی</h4>
          <p className="text-dark text-sm">کتاب‌ها در حساب شما ذخیره می‌شوند</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h4 className="font-bold text-dark text-sm">جستجوی سریع</h4>
          <p className="text-dark text-sm">کتاب‌ها را به راحتی پیدا کنید</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h4 className="font-bold text-dark text-sm">قیمت مناسب</h4>
          <p className="text-dark text-sm">بدون هزینه چاپ و ارسال</p>
        </div>
      </div>
    </section>
  );
}