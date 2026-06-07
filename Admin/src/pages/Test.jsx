import React from "react";
// Examples of usage
import { Button } from "../components/common/Button";
import { FiArrowRight, FiPlus } from "react-icons/fi";

const Test = () => {
  return (
    <div className="p-8 bg-bg-base min-h-screen flex flex-col gap-4 items-start">
      <Button variant="primary" size="lg">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="warning">Warning Action</Button>
      <Button variant="danger">Danger Action</Button>
      <Button variant="success">Success Action</Button>
    </div>
  );
};

export default Test;


