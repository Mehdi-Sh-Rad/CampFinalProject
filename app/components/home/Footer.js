export default function Footer() {
  return (
    <footer className="p-4 md:p-8 bg-dark text-background text-center my-12">
      <h4 className="text-lg md:text-xl font-semibold mb-2">
        عضویت در خبرنامه بوکینو
      </h4>
      <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4">
        <input
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300"
        />
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary">
          عضویت
        </button>
      </div>
      <hr className="my-4 border-t border-gray-600" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base">
        <p>شعب: تهران، شیراز، بندرعباس</p>
        <p>تماس با ما: support@bookino.ir</p>
      </div>
      <p className="text-sm mt-4">© ۲۰۲۵ بوکینو - تمامی حقوق محفوظ است</p>
    </footer>
  );
}
