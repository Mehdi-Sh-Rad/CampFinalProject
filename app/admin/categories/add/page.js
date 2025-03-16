"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام دسته بندی الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام دستع بندی باید بین ۳ تا ۳۰ باشد");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در ساخت دسته بندی پیش آمده است");
      router.push("/admin/categories");
    } catch (error) {
      setError(error.message);
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
            <h2 className="my-4">افزودن دسته بندی جدید</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام دسته بندی</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام دسته بندی ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Button type="submit">ذخیره</Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategory;
