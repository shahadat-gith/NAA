import React, { useContext, useState, useRef } from "react";
import "./Notice.css";
import { AdminContext } from "../../context/AdminContext";
import toast from 'react-hot-toast';
import axios from "axios";

const Notice = () => {
  const today = new Date().toISOString().split("T")[0];
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("academic");
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("category", category);
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    console.log("Sending payload:", { title, description, date, category, pdfFile });

    toast.promise(
      axios.post(`${backendUrl}/api/admin/add-notice`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        pending: "Adding notice...",
        success: "Notice added successfully!",
        error: "Failed to add notice."
      }
    )
      .then((response) => {
        console.log("API Response:", response.data);
        setTitle("");
        setDescription("");
        setDate(today);
        setCategory("academic");
        setPdfFile(null);
        fileInputRef.current.value = null;
      })
      .catch((error) => {
        console.error("Error adding notice:", error);
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          toast.error("No response from server.");
        } else {
          toast.error("Error: " + error.message);
        }
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("Please select a valid PDF file");
      setPdfFile(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="admin-content">
      <h1>Notices Management</h1>
      <form onSubmit={handleSubmit} className="notices-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="notice-title">Title</label>
            <input
              type="text"
              id="notice-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="notice-date">Date</label>
            <input
              type="date"
              id="notice-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="notice-category">Category</label>
            <select
              id="notice-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="academic">Academic</option>
              <option value="administrative">Administrative</option>
              <option value="extracurricular">Extracurricular</option>
            </select>
          </div>
        </div>
        <div className="form-row">

          <div className="form-group">
            <label htmlFor="notice-description">Description</label>
            <textarea
              id="notice-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notice description"
              required
            />
          </div>
        </div>


        <div className="form-group full-width">
          <label htmlFor="notice-pdf">Attach PDF (Optional)</label>
          <div className="custom-file-upload">
            <button type="button" onClick={triggerFileInput} className="upload-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload PDF
            </button>
            <input
              type="file"
              id="notice-pdf"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {pdfFile && <span className="file-name">{pdfFile.name}</span>}
          </div>
        </div>
        <button type="submit" className="premium-button">
          Add Notice
        </button>
      </form>
    </div>
  );
};

export default Notice;