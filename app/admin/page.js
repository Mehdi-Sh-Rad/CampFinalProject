"use client";
import Image from "next/image";
import AuthWrapper from "../components/auth/auth";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../lib/fetch/Products";
import { getComments } from "../lib/fetch/Comments";
import { getUsers } from "../lib/fetch/Users";
import { getPayments } from "../lib/fetch/Payments";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set global font settings
ChartJS.defaults.font.family = "'Vazirmatn', sans-serif";
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.weight = "normal";
ChartJS.defaults.color = "#333";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Payments, Products, Users, Comments, and Tickets
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await getPayments();
        if (!data) throw new Error("مشکل در دریافت لیست پرداختی ها ");
        setPayments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        if (!data) throw new Error("مشکل در دریافت محصولات ");
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        if (!data) throw new Error("مشکل در دریافت لیست کاربران ");
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments();
        if (!data) throw new Error("مشکل در دریافت لیست نظرات ");
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tickets");

        if (!response.ok) throw new Error("مشکل در دریافت اطلاعات تیکت ها ");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);


  // Calculate sume of payments
  const totalPayments = payments.reduce((sum, payment) =>
    sum + (parseFloat(payment.totalPrice) || 0), 0);

  // Calculate yearly, monthly, weekly, and daily payments
  const now = dayjs();

  const yearlyPayments = payments
    .filter((payment) => dayjs(payment.createdAt).isAfter(now.startOf("year")))
    .reduce((sum, payment) => sum + (parseFloat(payment.totalPrice) || 0), 0);

  const monthlyPayments = payments
    .filter((payment) => dayjs(payment.createdAt).isAfter(now.startOf("month")))
    .reduce((sum, payment) => sum + (parseFloat(payment.totalPrice) || 0), 0);

  const weeklyPayments = payments
    .filter((payment) => dayjs(payment.createdAt).isAfter(now.startOf("week")))
    .reduce((sum, payment) => sum + (parseFloat(payment.totalPrice) || 0), 0);

  const dailyPayments = payments
    .filter((payment) => dayjs(payment.createdAt).isAfter(now.startOf("day")))
    .reduce((sum, payment) => sum + (parseFloat(payment.totalPrice) || 0), 0);

  const productsCount = products.length;
  const usersCount = users.length;
  const commentsCount = comments.length;
  const ticketsCount = tickets.length;


  // Bar chart data for sales
  const barDataSales = {
    labels: ["سالانه", "ماهانه", "هفتگی", "روزانه"],

    datasets: [
      {
        label: "آمار فروش فروشگاه",
        data: [yearlyPayments, monthlyPayments, weeklyPayments, dailyPayments],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for users, products, comments, and tickets
  const barData = {
    labels: ["کاربران", "محصولات", "نظرات", "تیکت ها"],

    datasets: [
      {
        label: "اطلاعات تحلیلی وب سایت",
        data: [usersCount, productsCount, commentsCount, ticketsCount],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate total price and discount price
  const totalPrice = products.reduce((sum, product) =>
    sum + (parseFloat(product.price) || 0), 0);

  const totalDiscount = products.reduce((sum, product) =>
    sum + (parseFloat(product.discountPrice) || 0), 0);

  const productsFreeCount = products.filter((product) =>
    product.price === 0).length;

  // Pie chart data for total price and discount price
  const piePriceData = {
    labels: ["درصد قیمت محصولات با تخفیف"],
    datasets: [
      {
        label: "Product Data",
        data: [totalPrice, totalDiscount],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue for total prices
          "rgba(255, 206, 86, 0.6)", // Yellow for discount prices
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate the percentage of free and non-free products
  const percentageFreeProducts = ((productsFreeCount / productsCount) * 100).toFixed(2); // Percentage of free products
  const percentageNonFreeProducts = (100 - percentageFreeProducts).toFixed(2); // Percentage of non-free products

  // Pie chart data for free and non-free products
  const pieFreeProductsData = {
    labels: ["درصد محصولات رایگان"],
    datasets: [
      {
        label: "درصد محصولات",
        data: [percentageFreeProducts, percentageNonFreeProducts], // Use percentages
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Green for free products
          "rgba(255, 99, 132, 0.6)", // Red for non-free products
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //Dark mode theme
  const { isDarkMode } = useTheme();

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }
      },
    },
  };
  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        },
      },
    },
  };

  return (
    <AuthWrapper>
      <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh]">
        <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
          <h1 className="text-white absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">
            پنل ادمین
          </h1>
          <span className="text-white absolute z-10 right-8 top-20 text-xs sm:text-base">
            پنل مدیریت برای مدیریت محتوای سایت، مشاهده آمار و انجام تنظیمات مختلف.
          </span>
          <Image
            className="absolute object-fill w-full h-full left-0 top-0 right-0 bottom-0 header-img"
            src={"/uploads/top-header.png"}
            alt="هدر"
            width={1663}
            height={277}
          />
        </div>
        <div className="container py-4 px-10 -mt-10 z-30 relative">
          <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark">
            <h1 className="mb-10 dark:text-neutral-200">پیشخوان</h1>
            {loading && <p>در حال بارگذاری...</p>}
            <div style={{ width: "100%", height: "400px" }} className="my-4 flex justify-center ">
              <Bar data={barDataSales} options={barOptions} />
            </div>
            <div style={{ width: "100%", height: "400px" }} className="my-4 flex justify-center ">
              <Bar data={barData} options={barOptions} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "50px" }}>
              <div className="flex justify-center" style={{ flex: 1, height: "400px" }}>
                <Pie data={piePriceData} options={pieOptions} />
              </div>
              <div className="flex justify-center" style={{ flex: 1, height: "400px" }}>
                <Pie data={pieFreeProductsData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </AuthWrapper>
  );
};

export default AdminDashboard;