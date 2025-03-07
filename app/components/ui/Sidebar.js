import Link from "next/link";
import React from "react";
import { Nav } from "react-bootstrap";
import { FaBox, FaHome, FaTags } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Nav className="flex-column mt-3">
        <Link href="/admin">
          <FaHome />
          داشبورد
        </Link>
        <Link href="/admin/products">
          <FaBox />
          محصولات
        </Link>
      </Nav>
    </aside>
  );
};

export default Sidebar;
