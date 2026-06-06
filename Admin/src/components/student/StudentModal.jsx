import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { X } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { normaliseStudent } from "../../utils/utility";

const StudentModal = ({ isOpen, onClose, onSuccess, student, setStudent }) => {
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
    setFormData((prev) => ({ ...prev, dob: value }));
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
      return toast.error("Please select stream for Class 11 or 12");
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      return toast.error("Pincode must be 6 digits");
    }

    if (formData.dob && !/^\d{2}-\d{2}-\d{4}$/.test(formData.dob)) {
      return toast.error("DOB must be in DD-MM-YYYY format");
    }

    setLoading(true);

    try {
      const payload = normaliseStudent(formData);

      const res = isEditMode
        ? await axios.put(`${backendUrl}/api/student/${student._id}`, payload, {
            headers: { Authorization: `Bearer ${adminToken}` },
          })
        : await axios.post(`${backendUrl}/api/student/add/single`, payload, {
            headers: { Authorization: `Bearer ${adminToken}` },
          });

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-4xl max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEditMode ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto p-8 space-y-8"
        >
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Registration No <span className="text-red-500">*</span>
                </label>
                <input
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formData.dob}
                  onChange={handleDobChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Father Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Mother Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Medium <span className="text-red-500">*</span>
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">Select Medium</option>
                  <option value="english">English</option>
                  <option value="assamese">Assamese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  disabled={!formData.medium}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
                  required
                >
                  <option value="">Select Class</option>
                  {formData.medium &&
                    CLASS_OPTIONS[formData.medium]?.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {formData.medium === "assamese" &&
                ["11", "12"].includes(formData.class) && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                      Stream <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                      required
                    >
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
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Village
                </label>
                <input
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Post Office
                </label>
                <input
                  name="postOffice"
                  value={formData.postOffice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Police Station
                </label>
                <input
                  name="policeStation"
                  value={formData.policeStation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  District
                </label>
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Pincode
                </label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex-shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70"
          >
            {loading
              ? isEditMode
                ? "Updating Student..."
                : "Adding Student..."
              : isEditMode
              ? "Update Student"
              : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;