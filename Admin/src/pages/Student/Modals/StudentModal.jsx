import React, { useState, useContext, useEffect } from "react";
import "./StudentModal.css";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../../utils/academicOptions";
import { normaliseStudent } from "../../../utils/utility";

const StudentModal = ({
  isOpen,
  onClose,
  onSuccess,
  student,
  setStudent,
}) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const isEditMode = Boolean(student);

  const [loading, setLoading] = useState(false);

  const initialState = {
    name: "",
    class: "",
    stream: "",
    medium: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    phone: "",
    registrationNo: "",
    aadhar: "",
    pen: "",
    village: "",
    postOffice: "",
    policeStation: "",
    district: "",
    state: "",
    pincode: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isEditMode && student) {
      setFormData({
        name: student.name || "",
        class: student.class || "",
        stream: student.stream || "",
        medium: student.medium || "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        dob: student.dob || "",
        gender: student.gender || "",
        phone: student.phone || "",
        registrationNo: student.registrationNo || "",
        aadhar: student.aadhar || "",
        pen: student.pen || "",
        village: student.address?.village || "",
        postOffice: student.address?.postOffice || "",
        policeStation: student.address?.policeStation || "",
        district: student.address?.district || "",
        state: student.address?.state || "",
        pincode: student.address?.pincode || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [student, isEditMode]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(initialState);
    setLoading(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "medium" ? { class: "", stream: "" } : {}),
      ...(name === "class" ? { stream: "" } : {}),
    }));
  };

  const handleDobChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 8);

    if (value.length >= 5) {
      value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`;
    }

    setFormData((prev) => ({
      ...prev,
      dob: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.medium ||
      !formData.class ||
      !formData.registrationNo
    ) {
      return toast.error("Please fill all required fields");
    }

    if (
      ["11", "12"].includes(formData.class) &&
      formData.medium === "assamese" &&
      !formData.stream
    ) {
      return toast.error("Please select stream for class 11 or 12");
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      return toast.error("Invalid pincode");
    }

    if (formData.dob && !/^\d{2}-\d{2}-\d{4}$/.test(formData.dob)) {
      return toast.error("DOB must be in DD-MM-YYYY format");
    }

    setLoading(true);

    try {
      const payload = normaliseStudent(formData);

      let res;

      if (isEditMode) {
        res = await axios.put(
          `${backendUrl}/api/student/${student._id}`,
          payload,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
      } else {
        res = await axios.post(
          `${backendUrl}/api/student/add/single`,
          payload,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
      }

      if (res.data.success) {
        toast.success(
          isEditMode
            ? "Student updated successfully"
            : "Student added successfully"
        );

        if (isEditMode && typeof setStudent === "function") {
          setStudent(res.data.student);
        }

        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ssm-modal-overlay" onClick={handleClose}>
      <div
        className="ssm-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ssm-modal-header">
          <h2>{isEditMode ? "Edit Student" : "Add Single Student"}</h2>
          <button className="ssm-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form className="ssm-form" onSubmit={handleSubmit}>
          <div className="ssm-form-grid">

            <div className="ssm-form-group">
              <label>Student Name <span className="ssm-required">*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="ssm-form-group">
              <label>Registration No <span className="ssm-required">*</span></label>
              <input
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                disabled={isEditMode}
              />
            </div>

            <div className="ssm-form-group">
              <label>Phone <span className="ssm-required">*</span></label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="ssm-form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ssm-form-group">
              <label>Date of Birth</label>
              <input
                type="text"
                placeholder="DD-MM-YYYY"
                value={formData.dob}
                onChange={handleDobChange}
                inputMode="numeric"
              />
            </div>

            <div className="ssm-form-group">
              <label>Father Name <span className="ssm-required">*</span></label>
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>

            <div className="ssm-form-group">
              <label>Mother Name <span className="ssm-required">*</span></label>
              <input name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>

            <div className="ssm-form-group">
              <label>Aadhar</label>
              <input name="aadhar" value={formData.aadhar} onChange={handleChange} />
            </div>

            <div className="ssm-form-group">
              <label>PEN</label>
              <input name="pen" value={formData.pen} onChange={handleChange} />
            </div>

          </div>

          <div className="ssm-form-grid">

            <div className="ssm-form-group">
              <label>Medium <span className="ssm-required">*</span></label>
              <select name="medium" value={formData.medium} onChange={handleChange}>
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            <div className="ssm-form-group">
              <label>Class <span className="ssm-required">*</span></label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                disabled={!formData.medium}
              >
                <option value="">Select Class</option>
                {formData.medium &&
                  CLASS_OPTIONS[formData.medium].map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
              </select>
            </div>

            {formData.medium === "assamese" &&
              ["11", "12"].includes(formData.class) && (
                <div className="ssm-form-group">
                  <label>Stream <span className="ssm-required">*</span></label>
                  <select name="stream" value={formData.stream} onChange={handleChange}>
                    <option value="">Select Stream</option>
                    {STREAM_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          </div>

          <div className="ssm-form-grid">
            <div className="ssm-form-group">
              <label>Village</label>
              <input name="village" value={formData.village} onChange={handleChange} />
            </div>
            <div className="ssm-form-group">
              <label>Post Office</label>
              <input name="postOffice" value={formData.postOffice} onChange={handleChange} />
            </div>
            <div className="ssm-form-group">
              <label>Police Station</label>
              <input name="policeStation" value={formData.policeStation} onChange={handleChange} />
            </div>
            <div className="ssm-form-group">
              <label>District</label>
              <input name="district" value={formData.district} onChange={handleChange} />
            </div>
            <div className="ssm-form-group">
              <label>State</label>
              <input name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="ssm-form-group">
              <label>Pincode</label>
              <input name="pincode" value={formData.pincode} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Student"
              : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;