import React from "react";
import { Navbar, NavbarBrand } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="d-flex justify-content-between">
      <NavbarBrand className="bg-info w-100 text-center text-white">فروشگاه آنلاین کتاب</NavbarBrand>
    </Navbar>
  );
};

export default Header;