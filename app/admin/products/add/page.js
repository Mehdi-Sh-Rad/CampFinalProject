"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [active, setActive] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState("");
  const [tags, setTags] = useState("");
  const [free, setFree] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("مشکلی در دریافت دسته بندی ها رخ داده است"));
  }, []);

  const validateForm = () => {
    if (!file) {
      setFormError("انتخاب فایل محصول الزامی میباشد");
      return false;
    }
    if (!image) {
      setFormError("انتخاب تصویر محصول الزامی میباشد");
      return false;
    }
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }
    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 3 || description.length > 500) {
      setFormError("توضیحات محصول باید بین ۳ تا ۵۰۰ باشد");
      return false;
    }
    if (!category) {
      setFormError("دسته بندی محصول باید باشد");
      return false;
    }
    if (!tags) {
      setFormError(" انتخاب حداقل یک برچسب برای محصول الزامی است");
      return false;
    }
    if (!types.trim() === "") {
      setFormError("انتخاب فرمت فایل محصول الزامی است");
      return false;
    }
    if (price <= 0) {
      setFormError(" قیمت محصول باید یک مقدار مثبت باشد در غیر اینصورت گزینه رایگان را تیک بزنید");
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("active", active ? "true" : "false");
      formData.append("category", category);
      formData.append("types", types);
      formData.append("tags", tags);
      formData.append("image", image);
      formData.append("free", free);

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }
      if (!response.ok) throw new Error("مشکلی در ساخت محصول پیش آمده است");
      router.push("/admin/products");
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
            <h2 className="my-4">افزودن محصول</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>فایل</Form.Label>
                <Form.Control
                  type="file"
                  accept="file/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تصویر</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="اسم محصول ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>توضیحات</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=" توضیحات محصول ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>دسته بندی</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">انتخاب دسته بندی</option>
                  {categories.map((cat) => {
                    return (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>برچسب ها</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="تگ‌ها را با کاما جدا کنید"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>فرمت فایل</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="در صورت وجود بیش از یک فرمت آنها را با کاما جدا کنید"
                  value={types}
                  onChange={(e) => setTypes(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>وضعیت :</Form.Label>
                <Form.Check
                  className="d-inline mx-2"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                /> فعال
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>قیمت</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>قیمت تخفیفی</Form.Label>
                <Form.Control
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>رایگان :</Form.Label>
                <Form.Check
                  className="d-inline mx-2"
                  type="checkbox"
                  checked={free}
                  onChange={(e) => setFree(e.target.checked)}
                /> بله
              </Form.Group>

              <Button type="submit">ذخیره</Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
