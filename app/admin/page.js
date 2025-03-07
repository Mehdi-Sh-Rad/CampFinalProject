import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

const AdminDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100">
          <Sidebar />
        </Col>
        <Col md={10}>
          <Header />
          <main className="content p-4">
            <h4>به پنل ادمین خوش آمدید</h4>
            <p>در این بخش میتوانید موارد مختلف فروشگاه را مدیریت کنید</p>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
