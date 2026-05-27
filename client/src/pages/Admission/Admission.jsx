import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  FORM_FIELDS,
  ADDRESS_FIELDS,
} from "../../Utils/utility";
import "./Admission.css";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Admission = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    phone: "",
    aadhar: "",
    pen: "",
    medium: "",
    class: "",
    stream: "",
    address: {
      village: "",
      postOffice: "",
      policeStation: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  /* ================= HANDLERS ================= */

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

    if (name === "medium") {
      setFormData((prev) => ({
        ...prev,
        medium: value,
        class: "",
        stream: "",
      }));
      return;
    }

    if (name === "class") {
      setFormData((prev) => ({
        ...prev,
        class: value,
        stream: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FIELD RENDERER ================= */

  const renderField = (field) => {
    const value = formData[field.name];

    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={value}
          required={field.isRequired}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        value={value}
        required={field.isRequired}
        onChange={handleChange}
      />
    );
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/admission/create`,
        formData
      );

      if (res.status !== 201 || !res.data?.admission) {
        toast.error(res.data?.message || "Admission creation failed");
        return;
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Admission submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-admission-page">
      {/* ================= FORM CONTAINER ================= */}
      <div className="adm-form-container">
        <h2 className="adm-page-title">New Student Admission</h2>

        <form className="adm-form" onSubmit={handleSubmit}>
          <div className="adm-form-grid">
            {FORM_FIELDS.map((field) => (
              <div className="adm-form-field" key={field.name}>
                <label>
                  {field.label} {field.isRequired && "*"}
                </label>
                {renderField(field)}
              </div>
            ))}

            {/* CLASS SELECT */}
            <div className="adm-form-field">
              <label>Class *</label>
              <select
                name="class"
                required
                disabled={!formData.medium}
                value={formData.class}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {formData.medium &&
                  CLASS_OPTIONS[formData.medium].map((cls) => (
                    <option key={cls} value={cls}>
                      {isNaN(cls)
                        ? cls.charAt(0).toUpperCase() + cls.slice(1)
                        : `Class ${cls}`}
                    </option>
                  ))}
              </select>
            </div>

            {/* STREAM SELECT */}
            {formData.medium === "assamese" &&
              ["11", "12"].includes(formData.class) && (
                <div className="adm-form-field">
                  <label>Stream *</label>
                  <select
                    name="stream"
                    required
                    value={formData.stream}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {STREAM_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          </div>

          {/* ADDRESS SECTION */}
          <h3 className="adm-address-title">Address Details</h3>
          <div className="adm-address-grid">
            {ADDRESS_FIELDS.map(({ label, name, isRequired }) => (
              <div className="adm-form-field" key={name}>
                <label>
                  {label} {isRequired && "*"}
                </label>
                <input
                  name={`address.${name}`}
                  value={formData.address[name]}
                  required={isRequired}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* SUBMIT INTERFACE ACTION */}
          <button
            type="submit"
            className="adm-submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>

      {/* ================= SUCCESS STATUS MODAL ================= */}
      {showSuccessModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal adm-success-card">
            <h2>🎉 Admission Successful</h2>

            <p className="adm-modal-text">
              Please visit the Principal’s Chamber and pay the admission fee to
              get the <strong>Admission Confirmation Receipt</strong>.
            </p>

            <div className="adm-modal-actions">
              <button
                className="adm-btn adm-btn-primary"
                onClick={() => navigate("/")}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;