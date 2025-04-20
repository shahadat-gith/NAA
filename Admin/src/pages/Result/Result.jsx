import React, { useState } from "react";
import "./Result.css";
import MassUploadForm from "./MassUploadForm";
import SingleUploadForm from "./SingleUploadForm";

const Result = () => {
  const [activeTab, setActiveTab] = useState("mass");

  return (
    <div className="admin-content-result">
      <div className="tabs">
        <button
          className={activeTab === "mass" ? "active" : ""}
          onClick={() => setActiveTab("mass")}
        >
          Mass Upload Results
        </button>
        <button
          className={activeTab === "single" ? "active" : ""}
          onClick={() => setActiveTab("single")}
        >
          Single Upload Result
        </button>
      </div>

      {activeTab === "mass" && <MassUploadForm />}
      {activeTab === "single" && <SingleUploadForm />}
    </div>
  );
};

export default Result;