import ForgetPasswordForm from "@/app/components/auth/ForgetPasswordForm";
import NoAuthWrapper from "@/app/components/auth/NoAuth";
import React from "react";

const Register = () => {
  return (
    <NoAuthWrapper>
      <ForgetPasswordForm/>
    </NoAuthWrapper>
  );
};

export default Register;
