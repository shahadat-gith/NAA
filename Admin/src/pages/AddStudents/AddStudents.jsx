import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import axios from "axios";
import "./AddStudents.css";
import Loader from '../../components/Loader/Loader'
import { AdminContext } from "../../context/AdminContext";

const AddStudents = () => {
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

  const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const streams = ["science", "arts"];

  const formatClassName = (cls) =>
    /^\d+$/.test(cls) ? `Class ${cls}` : cls.charAt(0).toUpperCase() + cls.slice(1);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selected.type === "application/vnd.ms-excel")
    ) {
      setFile(selected);
    } else {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
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

        const processedStudents = jsonData.map((row) => {
          const name =
            row.name?.toString().trim() ||
            row.Name?.toString().trim() ||
            `${(row.firstName || "").toString().trim()} ${(row.middleName || "").toString().trim()} ${(row.lastName || "").toString().trim()}`.trim();

          let hostel = row.hostel || row.Hostel || "No";
          hostel = hostel?.toString().toLowerCase();
          hostel = ["yes", "true", "1"].includes(hostel) ? "Yes" : "No";

          const father =
            row.father?.toString().trim() || row.Father?.toString().trim() || "";
          const mother =
            row.mother?.toString().trim() || row.Mother?.toString().trim() || "";

          return {
            name,
            father,
            mother,
            registrationNo: (row.registrationNo || row.RegistrationNo || "").toString().trim(),
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
        e.target.reset();
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
    setLoading(true)

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
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="add-students-container">
      {loading &&  <Loader text = {activeTab === "mass" ? "Adding Students..." : "Adding student..."}/>}
     
      <div className="tabs">
        <button onClick={() => setActiveTab("mass")} className={activeTab === "mass" ? "active" : ""}>
          Mass upload
        </button>
        <button onClick={() => setActiveTab("single")} className={activeTab === "single" ? "active" : ""}>
          Single Admission
        </button>
      </div>

      {activeTab === "mass" && (
        <>
          <h2>Add Existing Students</h2>
          <form onSubmit={handleBulkUpload}>
            <div className="form-group">
              <label>Medium:</label>
              <select value={medium} onChange={(e) => {
                setMedium(e.target.value);
                setStudentClass("");
                setStream("");
              }} required>
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            {medium && (
              <div className="form-group">
                <label>Class:</label>
                <select value={studentClass} onChange={(e) => {
                  setStudentClass(e.target.value);
                  setStream("");
                }} required>
                  <option value="">Select Class</option>
                  {(medium === "english" ? englishClasses : assameseClasses).map((cls) => (
                    <option key={cls} value={cls}>{formatClassName(cls)}</option>
                  ))}
                </select>
              </div>
            )}

            {medium === "assamese" && ["11", "12"].includes(studentClass) && (
              <div className="form-group">
                <label>Stream:</label>
                <select value={stream} onChange={(e) => setStream(e.target.value)} required>
                  <option value="">Select Stream</option>
                  {streams.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Upload Excel File:</label>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} required />
              <p className="info-text">Expected columns: name, registrationNo, father, mother, hostel (optional). Medium, class, and stream are taken from the form.</p>
            </div>

            <button type="submit" className="upload-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload Students"}
            </button>
          </form>
        </>
      )}

      {activeTab === "single" && (
        <>
          <h2>Single Student Admission</h2>
          <form onSubmit={handleSingleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" value={singleStudent.name} onChange={(e) => setSingleStudent({ ...singleStudent, name: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Father's Name:</label>
              <input type="text" value={singleStudent.father} onChange={(e) => setSingleStudent({ ...singleStudent, father: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Mother's Name:</label>
              <input type="text" value={singleStudent.mother} onChange={(e) => setSingleStudent({ ...singleStudent, mother: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Registration No:</label>
              <input type="text" value={singleStudent.registrationNo} onChange={(e) => setSingleStudent({ ...singleStudent, registrationNo: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Medium:</label>
              <select value={singleStudent.medium} onChange={(e) => setSingleStudent({ ...singleStudent, medium: e.target.value, class: "", stream: "" })} required>
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            <div className="form-group">
              <label>Class:</label>
              <select value={singleStudent.class} onChange={(e) => setSingleStudent({ ...singleStudent, class: e.target.value, stream: "" })} required>
                <option value="">Select Class</option>
                {(singleStudent.medium === "english" ? englishClasses : assameseClasses).map((cls) => (
                  <option key={cls} value={cls}>{formatClassName(cls)}</option>
                ))}
              </select>
            </div>

            {singleStudent.medium === "assamese" && ["11", "12"].includes(singleStudent.class) && (
              <div className="form-group">
                <label>Stream:</label>
                <select value={singleStudent.stream} onChange={(e) => setSingleStudent({ ...singleStudent, stream: e.target.value })} required>
                  <option value="">Select Stream</option>
                  {streams.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Hostel:</label>
              <select value={singleStudent.hostel} onChange={(e) => setSingleStudent({ ...singleStudent, hostel: e.target.value })} required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <button type="submit" className="upload-btn">{loading? "Adding...": "Add Student"}</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddStudents;
