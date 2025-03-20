import NoAuthWrapper from "@/app/components/auth/NoAuth";
import RegisterForm from "@/app/components/auth/RegisterForm";
import React from "react";

const Register = () => {
  return (
    <NoAuthWrapper>
      <RegisterForm />
    </NoAuthWrapper>
  );
};

export default Register;
