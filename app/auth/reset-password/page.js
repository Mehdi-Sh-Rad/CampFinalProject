import NoAuthWrapper from "@/app/components/auth/NoAuth";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import React from "react";

const Register = () => {
  return (
    <NoAuthWrapper>
      <ResetPasswordForm/>
    </NoAuthWrapper>
  );
};

export default Register;
