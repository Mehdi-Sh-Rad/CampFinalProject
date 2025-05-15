"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import {FaSearch,  FaShoppingCart,  FaBars,  FaTimes,  FaSignOutAlt,  FaUserCog,  FaUser,  FaBook,  FaNewspaper,  FaGift,  FaMoneyBill,  FaEye,  FaShoppingBag,} from "react-icons/fa";
import CartPopup from "@/app/components/carts/CartPopup";

// icons for circle menu
const categoryIcons = {
  مقالات: <FaNewspaper size={20} className="text-dark" />,
  "همه دسته‌ها": <FaBook size={20} className="text-dark" />,
  "تخفیف‌دارها": <FaGift size={20} className="text-dark" />,
  "رایگان": <FaMoneyBill size={20} className="text-dark" />,
  "پربازدیدترین": <FaEye size={20} className="text-dark" />,
  "پرفروش‌ترین": <FaShoppingBag size={20} className="text-dark" />,
};

// lists of static ones in circle menu
const staticMenuItems = [
  { name: "همه دسته‌ها", href: "/categories", icon: <FaBook size={20} className="text-dark" /> },
  { name: "مقالات", href: "/blogs", icon: <FaNewspaper size={20} className="text-dark" /> },
  { name: "تخفیف‌دارها", href: "/products?discountPrice=true", icon: <FaGift size={20} className="text-dark" /> },
  { name: "رایگان", href: "/products?free=true", icon: <FaMoneyBill size={20} className="text-dark" /> },
  { name: "پربازدیدترین", href: "/products?sort=view-desc", icon: <FaEye size={20} className="text-dark" /> },
  { name: "پرفروش‌ترین", href: "/products?sort=sold-desc", icon: <FaShoppingBag size={20} className="text-dark" /> },
];

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isMenuVisible, setIsMenuVisible] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logoSettings, setLogoSettings] = useState(null);
  const [siteSetting, setSiteSetting] = useState("");
  const { cart, isCartPopupVisible, setIsCartPopupVisible, toggleCartPopup } = useCart();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [circleMenuHeight, setCircleMenuHeight] = useState(0);
  const [hamburgerMenuHeight, setHamburgerMenuHeight] = useState(0);
  const headerRef = useRef(null); 
  const circleMenuRef = useRef(null); 
  const hamburgerMenuRef = useRef(null); 

  //calculate totalItems
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    //fetch logo and siteSetting
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const logoResponse = await fetch("/api/logo");
        const logoData = await logoResponse.json();
        setLogoSettings(logoData);

        const siteSettingResponse = await fetch("/api/siteSetting");
        const siteSettingData = await siteSettingResponse.json();
        setSiteSetting({
          slogan: siteSettingData.slogan,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLogoSettings({ headerLogo: "/PersianLogo.png" });
      }
    };
    fetchSettings();
  }, []);

//Dynamic height calculation
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const updateHeight = () => {
      const height = headerElement.offsetHeight;
      setHeaderHeight(height);
    };

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(headerElement);
    updateHeight();

    return () => {
      observer.disconnect();
    };
  }, [isMenuOpen, isMenuVisible]);

  //Adjust the height when menu is open
  useEffect(() => {
    const circleMenuElement = circleMenuRef.current;
    if (!circleMenuElement || !isMenuVisible) {
      setCircleMenuHeight(0);
      return;
    }

    const updateCircleMenuHeight = () => {
      const height = circleMenuElement.offsetHeight;
      setCircleMenuHeight(height);
    };

    const observer = new ResizeObserver(() => {
      updateCircleMenuHeight();
    });

    observer.observe(circleMenuElement);
    updateCircleMenuHeight();

    return () => {
      observer.disconnect();
    };
  }, [isMenuVisible]);

  // Calculate the height of the hamburger menu
  useEffect(() => {
    const hamburgerMenuElement = hamburgerMenuRef.current;
    if (!hamburgerMenuElement || !isMenuOpen) {
      setHamburgerMenuHeight(0);
      return;
    }

    const updateHamburgerMenuHeight = () => {
      const height = hamburgerMenuElement.offsetHeight;
      setHamburgerMenuHeight(height);
    };

    const observer = new ResizeObserver(() => {
      updateHamburgerMenuHeight();
    });

    observer.observe(hamburgerMenuElement);
    updateHamburgerMenuHeight();

    return () => {
      observer.disconnect();
    };
  }, [isMenuOpen]);

  const totalHeight = headerHeight + (isMenuVisible ? circleMenuHeight : 0) + (isMenuOpen ? hamburgerMenuHeight : 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCircleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Admin panel redirection
  const handleAdminClick = () => {
    if (status === "authenticated") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/auth/login";
    }
  };

  // Fetch search results
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

  // Fetch search results when the search query changes
  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const circleMenuItems = [...staticMenuItems];

  const hamburgerMenuItems = [
    ...staticMenuItems.map((item) => ({
      name: item.name,
      href: item.href,
    })),
  ];

  return (
    <>  
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 w-full z-[1000] bg-background shadow-md"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative group hidden md:block">
                <button
                  onClick={toggleCircleMenu}
                  className="text-dark hover:text-secondary flex items-center gap-1"
                >
                  {isMenuVisible ? (
                    <FaTimes size={24} className="text-dark" />
                  ) : (
                    <FaBars size={24} className="text-dark" />
                  )}
                </button>
                <span className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-xs">
                  منو
                </span>
              </div>

              <Link href="/">
                <Image
                  src={logoSettings?.headerLogo || "/PersianLogo.png"}
                  alt="لوگوی سایت"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </Link>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-primary opacity-80 leading-none">
                  {siteSetting.slogan}
                </p>
              </div>
            </div>

            <div className="hidden md:flex md:flex-1 mx-4 relative max-w-lg">
              <input
                type="text"
                placeholder="جستجوی کتاب‌ها..."
                className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300 text-sm"
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
                    <div className="p-2 text-center text-dark text-sm">
                      در حال جستجو...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
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
                                <span className="line-through text-gray-400 mr-1">
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
                    <div className="p-2 text-center text-dark text-sm">
                      هیچ نتیجه‌ای یافت نشد
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <div
                  className="relative group"
                  onMouseEnter={() => setIsCartPopupVisible(true)}
                  onMouseLeave={() => setIsCartPopupVisible(false)}
                >
                  <Link
                    href="/cart"
                    className="text-dark hover:text-secondary flex items-center gap-1"
                    onClick={(e) => {
                      if (isCartPopupVisible) {
                        e.preventDefault(); 
                      }
                      toggleCartPopup();
                    }}
                  >
                    <FaShoppingCart size={22} className="text-dark" />
                    {totalItems > 0 && (
                      <span className="bg-red-400 text-white rounded-full w-4 h-4 flex items-center justify-center absolute -right-1 -top-1 text-[10px] font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <span className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-xs">
                    سبد
                  </span>
                  {isCartPopupVisible && <CartPopup />}
                </div>

               {session?.user ? (
                <div className="relative group">
                  <Link
                    href="/user"
                    className="text-dark hover:text-secondary flex items-center gap-1"
                  >
                    <FaUser size={22} className="text-dark" />
                  </Link>
                  <span className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-xs">
                    کاربر
                  </span>
                </div>) : ""
                
                }
                {session?.user?.isAdmin ? (
                  <div className="relative group">
                    <button
                      onClick={handleAdminClick}
                      className="text-dark hover:text-secondary flex items-center gap-1"
                    >
                      <FaUserCog size={28} className="text-dark" />
                    </button>
                    <span className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-xs">
                      ادمین
                    </span>
                  </div>
                ) : ""}

                {status === "authenticated" ? (
                  <div className="relative group">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-dark hover:text-secondary flex items-center gap-1"
                    >
                      <FaSignOutAlt size={24} className="text-red-500" />
                    </button>
                    <span className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-dark text-xs">
                      خروج
                    </span>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    ورود / ثبت‌نام
                  </Link>
                )}
              </div>
              <button className="md:hidden text-dark" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          <div className="md:hidden w-full mt-1 relative">
            <input
              type="text"
              placeholder="جستجوی کتاب‌ها..."
              className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-0 bg-white text-dark shadow-sm transition-all duration-300 text-sm"
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
                  <div className="p-2 text-center text-dark text-sm">
                    در حال بارگذاری...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
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
                              <span className="line-through text-gray-400 mr-1">
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
                  <div className="p-2 text-center text-dark text-sm">
                    هیچ نتیجه‌ای یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>

          {isMenuVisible && (
            <nav
              ref={circleMenuRef}
              className="py-1 bg-white hidden md:block absolute left-0 right-0 top-full animate-slide-down border border-gray-200 shadow-lg z-[1001]"
            >
              <div className="container mx-auto px-4">
                <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {circleMenuItems.map((item, index) => (
                    <li key={index} className="flex flex-col items-center">
                      <Link
                        href={item.href}
                        className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:shadow-md transition"
                      >
                        {item.icon}
                      </Link>
                      <span className="mt-1 text-sm text-dark">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}

          {isMenuOpen && (
            <nav
              ref={hamburgerMenuRef}
              className="md:hidden bg-white shadow-lg border border-gray-200 z-[1001]"
            >
              <ul className="flex flex-col gap-3 p-3 text-dark">
                <li>
                  <div className="flex flex-col mb-2">
                    <Link href="/">
                      <Image
                        src={logoSettings?.headerLogo || "/PersianLogo.png"}
                        alt="لوگوی سایت"
                        width={200}
                        height={60}
                        className="object-contain"
                      />
                    </Link>
                    <p className="text-xs font-medium text-primary opacity-80 leading-none mt-1">
                      {siteSetting.slogan}
                    </p>
                  </div>
                </li>
                {status === "authenticated" ? (
                  <li>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full bg-primary text-white px-3 py-1 rounded-lg hover:bg-secondary flex items-center gap-1 justify-center text-sm"
                    >
                      <FaSignOutAlt size={20} className="text-red-500" /> خروج
                    </button>
                    <hr className="border-t border-gray-200" />
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-1 hover:text-secondary py-1"
                    >
                      <FaUser size={20} /> ورود / ثبت نام
                    </Link>
                    <hr className="border-t border-gray-200" />
                  </li>
                )}
                <li>
                  <Link
                    href="/cart"
                    className="flex items-center gap-1 hover:text-secondary py-1"
                  >
                    <FaShoppingCart size={20} /> سبد خرید
                  </Link>
                  <hr className="border-t border-gray-200" />
                </li>
                <li>
                  <button
                    onClick={handleAdminClick}
                    className="block hover:text-secondary py-1"
                  >
                    پنل ادمین
                  </button>
                  <hr className="border-t border-gray-200" />
                </li>
                {hamburgerMenuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block hover:text-secondary py-1"
                    >
                      {item.name}
                    </Link>
                    <hr className="border-t border-gray-200" />
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <div style={{ height: `${totalHeight}px` }} />

    </>
  );
}