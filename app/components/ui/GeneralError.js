"use client";
import React, { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";

const GeneralError = ({ error, onRetry = null }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <div className="d-flex flex-column align-items-center my-4">
      <Alert variant="danger">
        {error?.messsage || "خطایی رخ داده است . لطفا مجددا تلاش کنید"}
      </Alert>
      {onRetry && (
        <Button onClick={onRetry} className="mt-3" variant="primary">
          تلاش مجدد
        </Button>
      )}
    </div>
  );
};

export default GeneralError;
