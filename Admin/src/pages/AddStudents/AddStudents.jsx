import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import axios from "axios";
import "./AddStudents.css";
import { AdminContext } from "../../context/AdminContext";

const AddStudents = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [file, setFile] = useState(null);
  const [medium, setMedium] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [stream, setStream] = useState("");
  const [loading, setLoading] = useState(false);

  const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const streams = ["science", "arts"];

  const formatClassName = (cls) => {
    return /^\d+$/.test(cls) ? `Class ${cls}` : cls.charAt(0).toUpperCase() + cls.slice(1);
  };

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
          let dob = row.dob || row.DOB || row["Date of Birth"] || row["date of birth"];
          if (dob) {
            if (typeof dob === "number") {
              const date = XLSX.SSF.parse_date_code(dob);
              dob = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
            } else if (typeof dob === "string") {
              const parts = dob.split(/[-\/]/);
              if (parts.length === 3) {
                if (parseInt(parts[0]) > 31) {
                  dob = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
                } else {
                  dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
                }
              }
            }
          }

          let hostel = row.hostel || row.Hostel;
          hostel = String(hostel || "").toLowerCase();
          hostel = ["yes", "true", "1"].includes(hostel) ? "Yes" : "No";

          return {
            firstName: row.firstName || row["First Name"] || "",
            middleName: row.middleName || row["Middle Name"] || "",
            lastName: row.lastName || row["Last Name"] || "",
            aadhar: String(row.aadhar || row.Aadhar || "").trim(),
            caste: row.caste || row.Caste || "",
            gender: row.gender || row.Gender || "",
            religion: row.religion || row.Religion || "",
            phone: String(row.phone || row.Phone || "").trim(),
            dob,
            fatherName: row.fatherName || row["Father Name"] || "",
            motherName: row.motherName || row["Mother Name"] || "",
            guardianContact: String(row.guardianContact || row["Guardian Contact"] || "").trim(),
            address: row.address || row.Address || "",
            district: row.district || row.District || "",
            state: row.state || row.State || "",
            pincode: String(row.pincode || row.Pincode || "").trim(),
            parentsOccupation: row.parentsOccupation || row["Parents Occupation"] || "",
            hostel,
            transport: row.transport || row.Transport || "No",
            admissionFee: parseFloat(row.admissionFee || row["Admission Fee"] || 0),
            hostelAdmissionFee: parseFloat(row.hostelAdmissionFee || row["Hostel Admission Fee"] || 0),
            medium, // From form input
            class: studentClass, // From form input
            stream: stream || "", // From form input
            registrationNo: String(row.registrationNo || row.RegistrationNo || "").trim(), // From Excel
            admissionStatus: "Pending",
            isNewAdmission: false,
          };
        });

        for (const student of processedStudents) {
          const required = [
            "firstName", "lastName", "aadhar", "caste", "gender", "religion", "phone", "dob",
            "fatherName", "motherName", "guardianContact", "address", "district", "state",
            "pincode", "parentsOccupation", "hostel", "transport", "medium", "class", "registrationNo"
          ];
          for (const field of required) {
            if (!student[field] || student[field].trim() === "") {
              throw new Error(`Missing required field "${field}" in student: ${student.firstName} ${student.lastName}`);
            }
          }
          if (!/^\d{12}$/.test(student.aadhar)) {
            throw new Error(`Invalid Aadhaar number for ${student.firstName} ${student.lastName}: must be 12 digits`);
          }
        }

        const res = await axios.post(
          `${backendUrl}/api/students/mass-admission`,
          { students: processedStudents },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        toast.success(res.data.message || "Students uploaded successfully!");
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

  return (
    <div className="add-students-container">
      <h2>Add Existing Students</h2>
      <form onSubmit={handleBulkUpload}>
        <div className="form-group">
          <label>Medium:</label>
          <select
            value={medium}
            onChange={(e) => {
              setMedium(e.target.value);
              setStudentClass("");
              setStream("");
            }}
            disabled={loading}
            required
          >
            <option value="">Select Medium</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>
        </div>

        {medium && (
          <div className="form-group">
            <label>Class:</label>
            <select
              value={studentClass}
              onChange={(e) => {
                setStudentClass(e.target.value);
                setStream("");
              }}
              disabled={loading}
              required
            >
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
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select Stream</option>
              {streams.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Upload Excel File:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} disabled={loading} />
          <p className="info-text">
            Expected columns: firstName, lastName, aadhar (12 digits), caste, gender, religion, phone, dob (YYYY-MM-DD or DD/MM/YYYY), 
            fatherName, motherName, guardianContact, address, district, state, pincode, parentsOccupation, hostel (Yes/No), 
            transport (optional), admissionFee (optional), hostelAdmissionFee (optional), registrationNo (e.g., NAA-250201E).
          </p>
        </div>

        <button type="submit" className="upload-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload Students"}
        </button>
      </form>
    </div>
  );
};

export default AddStudents;