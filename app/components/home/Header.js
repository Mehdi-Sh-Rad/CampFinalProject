"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCog,
  FaUser,
  FaBook,
  FaStar,
  FaFlag,
  FaGraduationCap,
  FaFeatherAlt,
  FaAward,
  FaNewspaper,
} from "react-icons/fa";

//icons for circle menu
const categoryIcons = {
  "زبان اصلی": <FaFlag size={20} />,
  دانشگاهی: <FaGraduationCap size={20} />,
  "ادبیات داستانی": <FaFeatherAlt size={20} />,
  پرفروش‌ها: <FaStar size={20} />,
  "جوایز ادبی": <FaAward size={20} />,
  مقالات: <FaNewspaper size={20} />,
  "همه دسته‌ها": <FaBook size={20} />,
};

// lists of dynamic categories that we choose to show in circle menu
const desiredCategories = ["زبان اصلی", "دانشگاهی", "ادبیات داستانی"];

// lists of static ones in circle menu
const staticMenuItems = [
  { name: "همه دسته‌ها", href: "/categories", icon: <FaBook size={20} /> },
  { name: "پرفروش‌ها", href: "#", icon: <FaStar size={20} /> },
  { name: "جوایز ادبی", href: "/products/awards", icon: <FaAward size={20} /> },
  { name: "مقالات", href: "/blogs", icon: <FaNewspaper size={20} /> },
];

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logoSettings, setLogoSettings] = useState(null);
  const [siteSetting, setSiteSetting] = useState({
    title: "بوکینو",
    slogan: "جهان کتاب، در دستان شما",
  });
  const [categories, setCategories] = useState([]);
  const { cart } = useCart();

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const logoResponse = await fetch("/api/logo");
        const logoData = await logoResponse.json();
        setLogoSettings(logoData);

        const siteSettingResponse = await fetch("/api/siteSetting");
        const siteSettingData = await siteSettingResponse.json();
        setSiteSetting({
          title: siteSettingData.title,
          slogan: siteSettingData.slogan,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLogoSettings({ headerLogo: "/PersianLogo.png" });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        const filteredCategories = data.filter((cat) =>
          desiredCategories.includes(cat.name)
        );
        setCategories(filteredCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminClick = () => {
    if (status === "authenticated") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/auth/login";
    }
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/search?search=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const circleMenuItems = [
    ...staticMenuItems,
    ...categories.map((category) => ({
      name: category.name,
      href: `/products?category=${category._id}`,
      icon: categoryIcons[category.name] || <FaBook size={20} />,
    })),
  ];

  const hamburgerMenuItems = [
    ...staticMenuItems.map((item) => ({
      name: item.name,
      href: item.href,
    })),
    ...categories.map((category) => ({
      name: category.name,
      href: `/products?category=${category._id}`,
    })),
  ];

  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center border-b border-gray-200">
          <Link href="/">
            <Image
              src={logoSettings?.headerLogo || "/PersianLogo.png"}
              alt="لوگوی سایت"
              width={200}
              height={60}
              className="object-contain"
            />
          </Link>

          <div className="hidden md:flex md:flex-1 mx-4 relative max-w-lg">
            <input
              type="text"
              placeholder="جستجوی کتاب‌ها..."
              className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark"
              size={20}
            />
            {searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto z-10 mt-1">
                {isLoading ? (
                  <div className="p-4 text-center text-dark">
                    در حال جستجو...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="flex items-center gap-4 p-3 hover:bg-gray-100 transition"
                    >
                      {product.imageUrls?.[0] && (
                        <Image
                          src={product.imageUrls[0]}
                          alt={product.name}
                          width={40}
                          height={60}
                          className="object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-dark">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {product.author}
                        </p>
                        <p className="text-xs text-dark">
                          {product.free ? (
                            "رایگان"
                          ) : product.discountPrice ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">
                                {product.price} تومان
                              </span>
                              <span className="text-green-600">
                                {product.discountPrice} تومان
                              </span>
                            </>
                          ) : (
                            `${product.price} تومان`
                          )}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-dark">
                    هیچ نتیجه‌ای یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <Link
                  href="/cart"
                  className="btn btn-link position-relative text-dark header-cart-link"
                >
                  <FaShoppingCart size={22} className="text-dark" />
                </Link>
                <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                  سبد
                </span>
                {totalItems > 0 && (
                  <span
                    style={{ top: "80%" }}
                    className="bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center absolute -right-2 -top-2 text-xs font-bold"
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="relative group">
                <Link
                  href="/user"
                  className="text-dark hover:text-secondary flex items-center gap-2"
                >
                  <FaUser size={22} className="text-dark" />
                </Link>
                <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                  کاربر
                </span>
              </div>
              {session?.user?.isAdmin ? (
                <div className="relative group">
                  <button
                    onClick={handleAdminClick}
                    className="text-dark hover:text-secondary flex items-center gap-2"
                  >
                    <FaUserCog size={28} className="text-dark" />
                  </button>
                  <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                    ادمین
                  </span>
                </div>
              ): ""}
             
              {status === "authenticated" ? (
                <div className="relative group">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-dark hover:text-secondary flex items-center gap-2"
                  >
                    <FaSignOutAlt size={24} className="text-red-500" />
                  </button>
                  <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-sm">
                    خروج
                  </span>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-primary text-white px-4 py-1 rounded-lg hover:bg-secondary"
                >
                  ورود/ثبت‌نام
                </Link>
              )}
            </div>
            <button className="md:hidden text-dark" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        <div className="md:hidden w-full mt-2 relative">
          <input
            type="text"
            placeholder="جستجوی کتاب‌ها..."
            className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark"
            size={20}
          />
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto z-10 mt-1">
              {isLoading ? (
                <div className="p-4 text-center text-dark">
                  در حال بارگذاری...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100 transition"
                  >
                    {product.imageUrls?.[0] && (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        width={40}
                        height={60}
                        className="object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-dark">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">{product.author}</p>
                      <p className="text-xs text-dark">
                        {product.free ? (
                          "رایگان"
                        ) : product.discountPrice ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">
                              {product.price} تومان
                            </span>
                            <span className="text-green-600">
                              {product.discountPrice} تومان
                            </span>
                          </>
                        ) : (
                          `${product.price} تومان`
                        )}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-dark">
                  هیچ نتیجه‌ای یافت نشد
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center py-2">
          <h1 className="text-lg md:text-xl font-bold text-primary">
            {siteSetting.title}
          </h1>
          <p className="text-base md:text-lg font-medium text-primary mt-1 opacity-80">
            {siteSetting.slogan}
          </p>
        </div>
      </div>

      <nav className="py-4 bg-white hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {circleMenuItems.map((item, index) => (
              <li key={index} className="flex flex-col items-center">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
                >
                  {item.icon}
                </Link>
                <span className="mt-2 text-sm text-dark">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-4 text-dark">
            {status === "authenticated" ? (
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-primary text-white px-4 py-1 rounded-lg hover:bg-secondary flex items-center gap-2 justify-center"
                >
                  <FaSignOutAlt size={20} className="text-red-500" /> خروج
                </button>
                <hr className="border-t border-gray-200" />
              </li>
            ) : (
              <li>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 hover:text-secondary py-2"
                >
                  <FaUser /> ورود / ثبت نام
                </Link>
                <hr className="border-t border-gray-200" />
              </li>
            )}
            <li>
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-secondary py-2"
              >
                <FaShoppingCart /> سبد خرید
              </Link>
              <hr className="border-t border-gray-200" />
            </li>
            <li>
              <button
                onClick={handleAdminClick}
                className="block hover:text-secondary py-2"
              >
                پنل ادمین
              </button>
              <hr className="border-t border-gray-200" />
            </li>
            {hamburgerMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block hover:text-secondary py-2"
                >
                  {item.name}
                </Link>
                <hr className="border-t border-gray-200" />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
