import Link from "next/link";
import React from "react";
import { Nav } from "react-bootstrap";
import { FaBox, FaComment, FaHome, FaTags } from "react-icons/fa";
import { RiAdminLine , RiDiscountPercentFill } from "react-icons/ri";


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Nav className="flex-column mt-3">
        <Link href="/">
          <FaHome />
          خانه
        </Link>
        <Link href="/admin">
          <RiAdminLine />
          داشبود ادمین
        </Link>
        <Link href="/admin/categories" className="mx-3">
          <FaTags />
          دسته بندی ها
        </Link>
        <Link href="/admin/products" className="mx-3">
          <FaBox />
          محصولات
        </Link>
        <Link href="/admin/discounts" className="mx-3">
          <RiDiscountPercentFill />
           کدهای تخفیف
        </Link>
        <Link href="/admin/comments" className="mx-3">
          <FaComment />
           نظرات
        </Link>
      </Nav>
    </aside>
  );
};

export default Sidebar;
