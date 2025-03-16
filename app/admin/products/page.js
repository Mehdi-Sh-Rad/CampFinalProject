"use client";
import GeneralError from "@/app/components/ui/GeneralError";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");

        if (!response.ok) throw new Error("مشکل در دریافت محصولات ");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      setError("مشکلی در حذف پیش آمد");
    }
  };
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100">
          <Sidebar />
        </Col>
        <Col md={10}>
          <Header />
          <main className="p-4">
            <h4 className="my-4">مدیریت محصولات</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="products/add"
                  className="btn-custom-add mb-3 px-2 py-1 rounded"
                >
                  <AiOutlinePlus />
                  افزودن
                </Link>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>شناسه</th>
                      <th>نام</th>
                      <th>توضیحات</th>
                      <th>دسته بندی</th>
                      <th>تصویر</th>
                      <th>قیمت</th>
                      <th>فرمت </th>
                      <th>وضعیت </th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.category?.name || "بدون دسته بندی"}</td>
                          <td>
                            <img
                              src={product.imageUrl}
                              alt=""
                              width="50"
                              height="50"
                            />
                          </td>
                          <td>{product.price}</td>
                          <td>{product.types}</td>
                          <td>{
                            product.active? "فعال" : "غیرفعال"  
                            }</td>
                          <td>
                            <div className="btn-group-inline">
                              <Link
                                href={`/admin/products/${product._id}`}
                                className="btn-custom-edit"
                              >
                                <AiOutlineEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="btn-custom-delete"
                              >
                                <AiOutlineDelete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
