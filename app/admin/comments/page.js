"use client";
import GeneralError from "@/app/components/ui/GeneralError";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";

const Comments = () => {
  const [Comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/Comments");

        if (!response.ok) throw new Error("مشکل در دریافت دیدگاه شما وجود دارد مجددا بعدا تلاش کنید");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/Comments/${id}`, { method: "DELETE" });
      setComments(Comments.filter((comment) => comment._id !== id));
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
            <h4 className="my-4 from-neutral-600">نظرات کاربران</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="Comments/add"
                  className="btn-custom-add mb-3 px-2 py-1 rounded"
                >
                  <AiOutlinePlus />
                دیدگاه مشتری ها 
                  
                </Link>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>نام کاربر</th>
                      <th>شماره تلفن</th>
                      <th>ایمیل</th>
                      <th>دیدگاه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Comments.map((comment, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{comment.name}</td>
                          <td>
                            <div className="btn-group-inline">
                              <Link
                                href={`/admin/Comments/${comment._id}`}
                                className="btn-custom-edit"
                              >
                                <AiOutlineEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(comment._id)}
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

export default Comments;