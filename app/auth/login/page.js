import LoginForm from "@/app/components/auth/LoginForm";
import NoAuthWrapper from "@/app/components/auth/NoAuth";
import React from "react";

const page = () => {
  return (
    <NoAuthWrapper>
      <LoginForm />
    </NoAuthWrapper>
  );
};

export default page;
