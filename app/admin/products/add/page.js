"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddProduct = () => {
  
  const [file, setFile] = useState(null);
  // const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [categories, setCategories] = useState('');
  // const [tags, setTags] = useState('');
  // const [fileTypes, setFileTypes] = useState("");
  const [active, setActive] = useState(false);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [Free, setFree] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const validateForm = () => {

    // if (!file) {
    //   setFormError("انتخاب فایل محصول میباشد");
    //   return false;
    // }
    // if (!image) {
    //   setFormError("انتخاب تصویرالزامی میباشد");
    //   return false;
    // }
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 2 || name.length > 30) {
      setFormError("نام محصول باید بین ۲ تا ۳۰ باشد");
      return false;
    }
    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 3 || description.length > 500) {
      setFormError("توضیحات محصول باید بین ۳ تا ۵۰۰ باشد");
      return false;
    }
    if (price <= 0) {
      setFormError("قیمت محصول باید یک مقدار مثبت باشد");
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
      // formData.append("fileUrl", file);
      // formData.append("imageUrl", image);
      formData.append("name", name);
      formData.append("description", description);
      // formData.append("categories", categories);
      // formData.append("tags", tags);
      // formData.append("fileTypes", fileTypes);
      formData.append("active", active);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      // formData.append("isFree", Free);      
      console.log(formData);
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
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                />
             </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>تصویر</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>توضیحات</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="توضیحات ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>دسته بندی</Form.Label>
                <Form.Select
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                >
                  <option value="">انتخاب دسته بندی</option>
                </Form.Select>
              </Form.Group> */}

              {/* <Form.Group className="mb-3">
                <Form.Label>تگ ها</Form.Label>
                <Form.Select
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                >
                  <option value="">انتخاب تگ های محصول</option>
                </Form.Select>
              </Form.Group> */}

              {/* <Form.Group className="mb-3">
                <Form.Label>فرمت فایل های محصول</Form.Label>
                <Form.Select
                  value={fileTypes}
                  onChange={(e) => setFileTypes(e.target.value)}
                >
                  <option value="">انتخاب فرمت فایل محصول</option>
                </Form.Select>
              </Form.Group> */}

              {/* <Form.Group className="mb-3">
                <Form.Label>فعال</Form.Label>
                <Form.Check
                  type="check"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Form.Group> */}

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

              {/* <Form.Group className="mb-3">
                <Form.Label>رایگان</Form.Label>
                <Form.Check
                  type="check"
                  checked={Free}
                  onChange={(e) => setFree(e.target.checked)}
                />
              </Form.Group> */}

              <Button type="submit">ذخیره</Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;