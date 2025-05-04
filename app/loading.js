import React from "react";
import Image from "next/image";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const Loading = () => {

  // return <LoadingSpinner />;
  return (
    <div className="flex justify-center items-center h-screen">
      <Image className={`transition-all duration-500 animate-pulse-scale`} src="/logo-min.png" height={100} width={100} alt="لوگو فروشگاه" />
    </div>
  );

};

export default Loading;

