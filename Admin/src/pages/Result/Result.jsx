import React, { useContext, useState } from "react";
import axios from "axios";
import UploadResults from "./UploadResults";
import "./Styles/Result.css";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";


const Result = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="result-page">
      {/* ================= HEADER ================= */}
      <div className="result-header">
        <div>
          <h2>Results</h2>
          <p className="result-subtitle">
            Manage and upload student exam results.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModalOpen(true)}
        >
          + Upload Result
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <UploadResults
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Result;
