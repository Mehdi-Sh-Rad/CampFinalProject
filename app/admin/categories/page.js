"use client";
import GeneralError from "@/app/components/ui/GeneralError";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) throw new Error("مشکل در دریافت دسته بندی ها");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((category) => category._id !== id));
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
            <h4 className="my-4">مدیریت دسته بندی ها</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="categories/add"
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
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>
                            <div className="btn-group-inline">
                              <Link
                                href={`/admin/categories/${category._id}`}
                                className="btn-custom-edit"
                              >
                                <AiOutlineEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(category._id)}
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

export default Categories;
