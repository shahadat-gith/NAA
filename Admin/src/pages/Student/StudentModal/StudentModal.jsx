import React, { useState, useRef, useContext } from "react";
import "./StudentModal.css";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import { formatClassName } from "../utils/formatclass";
const StudentModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState("mass");
  const [file, setFile] = useState(null);
  const [medium, setMedium] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [stream, setStream] = useState("");
  const [loading, setLoading] = useState(false);

  const [singleStudent, setSingleStudent] = useState({
    name: "",
    father: "",
    mother: "",
    registrationNo: "",
    class: "",
    medium: "",
    stream: "",
    hostel: "No",
  });

  const fileInputRef = useRef(null);

  const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const streams = ["science", "arts"];
  const maxClasses = 5; // Limit the number of students in bulk upload



  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selected.type === "application/vnd.ms-excel")
    ) {
      setFile(selected);
    } else {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file to upload");
    if (!medium) return toast.error("Please select a medium");
    if (!studentClass) return toast.error("Please select a class");
    if (medium === "assamese" && ["11", "12"].includes(studentClass) && !stream)
      return toast.error("Please select a stream for Class 11/12 in Assamese medium");
    if (!adminToken) return toast.error("Authentication missing. Please log in again.");

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const buffer = new Uint8Array(event.target.result);
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error("Excel file is empty");
          setLoading(false);
          return;
        }

        if (jsonData.length > maxClasses) {
          toast.error(`Cannot process more than ${maxClasses} students at a time`);
          setLoading(false);
          return;
        }

        const processedStudents = jsonData.map((row) => {
          const name =
            row.name?.toString().trim() ||
            row.Name?.toString().trim() ||
            `${(row.firstName || "").toString().trim()} ${(row.middleName || "").toString().trim()} ${(row.lastName || "").toString().trim()}`.trim();

          let hostel = row.hostel || row.Hostel || "No";
          hostel = hostel?.toString().toLowerCase();
          hostel = ["yes", "true", "1"].includes(hostel) ? "Yes" : "No";

          const father = row.father?.toString().trim() || row.Father?.toString().trim() || "";
          const mother = row.mother?.toString().trim() || row.Mother?.toString().trim() || "";
          const registrationNo = (row.registrationNo || row.RegistrationNo || "").toString().trim();

          return {
            name,
            father,
            mother,
            registrationNo,
            class: studentClass,
            medium,
            stream: stream || "",
            hostel,
          };
        });

        for (const student of processedStudents) {
          if (
            !student.name ||
            !student.father ||
            !student.mother ||
            !student.registrationNo ||
            !student.class ||
            !student.medium ||
            !student.hostel
          ) {
            throw new Error(
              `Missing required fields for student with registrationNo: ${student.registrationNo || "N/A"}`
            );
          }
        }

        const res = await axios.post(
          `${backendUrl}/api/students/mass-upload`,
          { students: processedStudents },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        toast.success(
          res.data.message ||
          `Inserted: ${res.data.insertedCount}, Skipped: ${res.data.skipped.length}`
        );
        setFile(null);
        setMedium("");
        setStudentClass("");
        setStream("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || err.message || "Upload failed");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading the file");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();

    const { name, father, mother, registrationNo, class: cls, medium, hostel } = singleStudent;

    if (!name || !father || !mother || !registrationNo || !cls || !medium || !hostel) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/students/create-single`, singleStudent, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.data.success) {
        toast.success("Student added successfully");
        setSingleStudent({
          name: "",
          father: "",
          mother: "",
          registrationNo: "",
          class: "",
          medium: "",
          stream: "",
          hostel: "No",
        });
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="naa-modal-overlay" onClick={onClose}>
      <div className="naa-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="naa-modal-header">
          <div className="naa-modal-title">
            <div className="naa-user-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Add Students</h2>
          </div>
          <button className="naa-close-button" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="naa-modal-content">
          <div className="naa-tabs">
            <button
              onClick={() => setActiveTab("mass")}
              className={activeTab === "mass" ? "naa-active" : ""}
              aria-label="Mass upload tab"
            >
              Mass Upload
            </button>
            <button
              onClick={() => setActiveTab("single")}
              className={activeTab === "single" ? "naa-active" : ""}
              aria-label="Single admission tab"
            >
              Single Admission
            </button>
          </div>

          {activeTab === "mass" && (
            <form className="naa-form" onSubmit={handleBulkUpload}>
              <div className="naa-form-section">
                <h3 className="naa-section-title">Mass Upload Students</h3>
                <div className="naa-form-grid">
                  <div className="naa-form-group">
                    <label htmlFor="mass-medium">
                      Medium <span className="naa-required">*</span>
                    </label>
                    <select
                      id="mass-medium"
                      value={medium}
                      onChange={(e) => {
                        setMedium(e.target.value);
                        setStudentClass("");
                        setStream("");
                      }}
                      required
                    >
                      <option value="">Select Medium</option>
                      <option value="english">English</option>
                      <option value="assamese">Assamese</option>
                    </select>
                  </div>

                  {medium && (
                    <div className="naa-form-group">
                      <label htmlFor="mass-class">
                        Class <span className="naa-required">*</span>
                      </label>
                      <select
                        id="mass-class"
                        value={studentClass}
                        onChange={(e) => {
                          setStudentClass(e.target.value);
                          setStream("");
                        }}
                        required
                      >
                        <option value="">Select Class</option>
                        {(medium === "english" ? englishClasses : assameseClasses).map((cls) => (
                          <option key={cls} value={cls}>
                            {formatClassName(cls)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {medium === "assamese" && ["11", "12"].includes(studentClass) && (
                    <div className="naa-form-group">
                      <label htmlFor="mass-stream">
                        Stream <span className="naa-required">*</span>
                      </label>
                      <select
                        id="mass-stream"
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        required
                      >
                        <option value="">Select Stream</option>
                        {streams.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="naa-form-group">
                    <label htmlFor="mass-file">
                      Upload Excel File <span className="naa-required">*</span>
                    </label>
                    <input
                      type="file"
                      id="mass-file"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="naa-form-actions">
                <button
                  type="submit"
                  className="naa-submit-btn"
                  disabled={loading}
                  aria-label="Upload students"
                >
                  {loading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Upload Students
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="naa-cancel-btn"
                  onClick={onClose}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {activeTab === "single" && (
            <form className="naa-form" onSubmit={handleSingleSubmit}>
              <div className="naa-form-section">
                <h3 className="naa-section-title">Single Student Admission</h3>
                <div className="naa-form-grid">
                  <div className="naa-form-group">
                    <label htmlFor="single-name">
                      Name <span className="naa-required">*</span>
                    </label>
                    <div className="naa-input-with-icon">

                      <input
                        type="text"
                        id="single-name"
                        value={singleStudent.name}
                        onChange={(e) => setSingleStudent({ ...singleStudent, name: e.target.value })}
                        placeholder="Enter student name"
                        required
                      />
                    </div>
                  </div>

                  <div className="naa-form-group">
                    <label htmlFor="single-father">
                      Father's Name <span className="naa-required">*</span>
                    </label>
                    <div className="naa-input-with-icon">

                      <input
                        type="text"
                        id="single-father"
                        value={singleStudent.father}
                        onChange={(e) => setSingleStudent({ ...singleStudent, father: e.target.value })}
                        placeholder="Enter father's name"
                        required
                      />
                    </div>
                  </div>

                  <div className="naa-form-group">
                    <label htmlFor="single-mother">
                      Mother's Name <span className="naa-required">*</span>
                    </label>
                    <div className="naa-input-with-icon">

                      <input
                        type="text"
                        id="single-mother"
                        value={singleStudent.mother}
                        onChange={(e) => setSingleStudent({ ...singleStudent, mother: e.target.value })}
                        placeholder="Enter mother's name"
                        required
                      />
                    </div>
                  </div>

                  <div className="naa-form-group">
                    <label htmlFor="single-registrationNo">
                      Registration No <span className="naa-required">*</span>
                    </label>
                    <div className="naa-input-with-icon">

                      <input
                        type="text"
                        id="single-registrationNo"
                        value={singleStudent.registrationNo}
                        onChange={(e) => setSingleStudent({ ...singleStudent, registrationNo: e.target.value })}
                        placeholder="Enter registration number"
                        required
                      />
                    </div>
                  </div>

                  <div className="naa-form-group">
                    <label htmlFor="single-medium">
                      Medium <span className="naa-required">*</span>
                    </label>
                    <select
                      id="single-medium"
                      value={singleStudent.medium}
                      onChange={(e) => setSingleStudent({ ...singleStudent, medium: e.target.value, class: "", stream: "" })}
                      required
                    >
                      <option value="">Select Medium</option>
                      <option value="english">English</option>
                      <option value="assamese">Assamese</option>
                    </select>
                  </div>

                  <div className="naa-form-group">
                    <label htmlFor="single-class">
                      Class <span className="naa-required">*</span>
                    </label>
                    <select
                      id="single-class"
                      value={singleStudent.class}
                      onChange={(e) => setSingleStudent({ ...singleStudent, class: e.target.value, stream: "" })}
                      required
                    >
                      <option value="">Select Class</option>
                      {(singleStudent.medium === "english" ? englishClasses : assameseClasses).map((cls) => (
                        <option key={cls} value={cls}>
                          {formatClassName(cls)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {singleStudent.medium === "assamese" && ["11", "12"].includes(singleStudent.class) && (
                    <div className="naa-form-group">
                      <label htmlFor="single-stream">
                        Stream <span className="naa-required">*</span>
                      </label>
                      <select
                        id="single-stream"
                        value={singleStudent.stream}
                        onChange={(e) => setSingleStudent({ ...singleStudent, stream: e.target.value })}
                        required
                      >
                        <option value="">Select Stream</option>
                        {streams.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="naa-form-group">
                    <label htmlFor="single-hostel">
                      Hostel <span className="naa-required">*</span>
                    </label>
                    <select
                      id="single-hostel"
                      value={singleStudent.hostel}
                      onChange={(e) => setSingleStudent({ ...singleStudent, hostel: e.target.value })}
                      required
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="naa-form-actions">
                  <button
                    type="submit"
                    className="naa-submit-btn"
                    disabled={loading}
                    aria-label="Add student"
                  >
                    {loading ? (
                      "Adding student..."
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add Student
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="naa-cancel-btn"
                    onClick={onClose}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>


            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentModal;