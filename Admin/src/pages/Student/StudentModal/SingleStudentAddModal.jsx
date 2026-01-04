import React, { useState, useContext } from "react";
import "./StudentModal.css";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../../utils/academicOptions";
import { formatClassName } from "../../../utils/utility";

const SingleStudentAddModal = ({ isOpen, onClose, fetchStudents }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    /* BASIC */
    name: "",
    class: "",
    stream: "",
    medium: "",

    /* PERSONAL */
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    phone: "",

    /* ACADEMIC */
    registrationNo: "",
    aadhar: "",
    pen: "",

    /* ADDRESS */
    village: "",
    postOffice: "",
    policeStation: "",
    district: "",
    state: "",
    pincode: "",
  });

  /* ================= UTILS ================= */

  const resetForm = () => {
    setFormData({
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
    });
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "medium" ? { class: "", stream: "" } : {}),
      ...(name === "class" ? { stream: "" } : {}),
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

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/add/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Student added successfully");
        fetchStudents?.();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="sm-modal-overlay" onClick={handleClose}>
      <div
        className="sm-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sm-modal-header">
          <h2>Add Single Student</h2>
          <button className="sm-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="sm-form" onSubmit={handleSubmit}>
          {/* BASIC */}
          <div className="sm-form-grid">
            <input
              name="name"
              placeholder="Student Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="registrationNo"
              placeholder="Registration No *"
              value={formData.registrationNo}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            <input
              name="fatherName"
              placeholder="Father Name *"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />

            <input
              name="motherName"
              placeholder="Mother Name *"
              value={formData.motherName}
              onChange={handleChange}
              required
            />

            <input
              name="aadhar"
              placeholder="Aadhar"
              value={formData.aadhar}
              onChange={handleChange}
            />

            <input
              name="pen"
              placeholder="PEN"
              value={formData.pen}
              onChange={handleChange}
            />
          </div>

          {/* ACADEMIC */}
          <div className="sm-form-grid">
            <select
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              required
            >
              <option value="">Select Medium *</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>

            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
              disabled={!formData.medium}
            >
              <option value="">Select Class *</option>
              {formData.medium &&
                CLASS_OPTIONS[formData.medium].map((cls) => (
                  <option key={cls} value={cls}>
                    {formatClassName(cls)}
                  </option>
                ))}
            </select>

            {formData.medium === "assamese" &&
              ["11", "12"].includes(formData.class) && (
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Stream *</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              )}
          </div>

          {/* ADDRESS */}
          <div className="sm-form-grid">
            <input
              name="village"
              placeholder="Village"
              value={formData.village}
              onChange={handleChange}
            />
            <input
              name="postOffice"
              placeholder="Post Office"
              value={formData.postOffice}
              onChange={handleChange}
            />
            <input
              name="policeStation"
              placeholder="Police Station"
              value={formData.policeStation}
              onChange={handleChange}
            />
            <input
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
            />
            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleStudentAddModal;
