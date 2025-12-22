import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SESSION_OPTIONS } from "../../../Utils/utility";
import "./Admission.css";
import { AppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

const Admission = () => {
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);

  const [showChoiceModal, setShowChoiceModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [admissionResult, setAdmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    phone: "",
    aadhar: "",
    medium: "",
    class: "",
    stream: "",
    academicSession: "",
    address: {
      village: "",
      po: "",
      ps: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  /* ================= HANDLERS ================= */

  const handleExistingStudent = () => {
    navigate("/portal/search", { state: { type: "admission" } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/admission/new`,
        formData
      );

      if (!res.data.success) {
        toast.error("Admission creation failed");
        return;
      }

      setAdmissionResult(res.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Admission submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-page">
      {/* ================= CHOICE MODAL ================= */}
      {showChoiceModal && (
        <div className="admission-modal-overlay">
          <div className="admission-modal">
            <h2>Admission Type</h2>
            <p>Please select how you want to proceed</p>

            <div className="admission-modal-actions">
              <button
                className="admission-btn primary"
                onClick={() => setShowChoiceModal(false)}
              >
                New Student
              </button>

              <button
                className="admission-btn secondary"
                onClick={handleExistingStudent}
              >
                Existing Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      {!showChoiceModal && (
        <div className="admission-form-container">
          <h2>New Student Admission</h2>

          <form className="admission-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Student Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div className="form-field">
                <label htmlFor="fatherName">Father's Name *</label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  placeholder="Enter father's name"
                  required
                  onChange={handleChange}
                  value={formData.fatherName}
                />
              </div>

              <div className="form-field">
                <label htmlFor="motherName">Mother's Name *</label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  placeholder="Enter mother's name"
                  required
                  onChange={handleChange}
                  value={formData.motherName}
                />
              </div>

              <div className="form-field">
                <label htmlFor="dob">Date of Birth *</label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  required
                  onChange={handleChange}
                  value={formData.dob}
                />
              </div>

              <div className="form-field">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  required
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>

              <div className="form-field">
                <label htmlFor="aadhar">Aadhar Number</label>
                <input
                  id="aadhar"
                  name="aadhar"
                  type="text"
                  placeholder="12-digit Aadhar number"
                  onChange={handleChange}
                  value={formData.aadhar}
                />
              </div>

              <div className="form-field">
                <label htmlFor="academicSession">Academic Session *</label>
                <select
                  id="academicSession"
                  name="academicSession"
                  required
                  onChange={handleChange}
                  value={formData.academicSession}
                >
                  <option value="">Select Academic Session</option>
                  {SESSION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="medium">Medium of Instruction *</label>
                <select
                  id="medium"
                  name="medium"
                  required
                  onChange={handleChange}
                  value={formData.medium}
                >
                  <option value="">Select Medium</option>
                  <option value="english">English</option>
                  <option value="assamese">Assamese</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="class">Class *</label>
                <select
                  id="class"
                  name="class"
                  required
                  onChange={handleChange}
                  value={formData.class}
                >
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      Class {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {Number(formData.class) >= 11 && (
                <div className="form-field">
                  <label htmlFor="stream">Stream *</label>
                  <select
                    id="stream"
                    name="stream"
                    required
                    onChange={handleChange}
                    value={formData.stream}
                  >
                    <option value="">Select Stream</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                  </select>
                </div>
              )}
            </div>

            <h3 className="address-title">Address Details</h3>
            <div className="address-grid">
              <div className="form-field">
                <label htmlFor="village">Village *</label>
                <input
                  id="village"
                  name="address.village"
                  type="text"
                  placeholder="Enter village name"
                  required
                  onChange={handleChange}
                  value={formData.address.village}
                />
              </div>

              <div className="form-field">
                <label htmlFor="po">Post Office *</label>
                <input
                  id="po"
                  name="address.po"
                  type="text"
                  placeholder="Enter post office"
                  required
                  onChange={handleChange}
                  value={formData.address.po}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ps">Police Station *</label>
                <input
                  id="ps"
                  name="address.ps"
                  type="text"
                  placeholder="Enter police station"
                  required
                  onChange={handleChange}
                  value={formData.address.ps}
                />
              </div>

              <div className="form-field">
                <label htmlFor="district">District *</label>
                <input
                  id="district"
                  name="address.district"
                  type="text"
                  placeholder="Enter district"
                  required
                  onChange={handleChange}
                  value={formData.address.district}
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  name="address.state"
                  type="text"
                  placeholder="Enter state"
                  required
                  onChange={handleChange}
                  value={formData.address.state}
                />
              </div>

              <div className="form-field">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  name="address.pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  required
                  onChange={handleChange}
                  value={formData.address.pincode}
                />
              </div>
            </div>

            <button
              type="submit"
              className="admission-submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {showSuccessModal && admissionResult && (
        <div className="admission-modal-overlay">
          <div className="admission-modal success">
            <h2>🎉 Admission Successful</h2>

            <p>
              Please <strong>note down the Registration Number</strong>. This
              will be required to search student details and pay fees later.
            </p>

            <div className="registration-box">
              <strong>Registration No:</strong>
              <span>{admissionResult.registrationNo}</span>
            </div>

            <div className="admission-modal-actions">
              <button
                className="admission-btn primary"
                onClick={() =>
                  navigate("/portal/payment", {
                    state: {
                      type: "admissionFee",
                      studentId: admissionResult.studentId,
                    },
                  })
                }
              >
                Pay Admission Fee Now
              </button>

              <button
                className="admission-btn secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/portal");
                }}
              >
                Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;