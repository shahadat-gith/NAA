import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { normaliseStudent } from "../../utils/utility";
import { Button } from "../common/Button";

const UpdateStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const student = location.state?.student;

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
    status: "current",
    village: "",
    postOffice: "",
    policeStation: "",
    district: "",
    state: "",
    pincode: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!student) {
      toast.error("No student selected");
      navigate("/students");
      return;
    }

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
      status: student.status || "current",
      village: student.address?.village || "",
      postOffice: student.address?.postOffice || "",
      policeStation: student.address?.policeStation || "",
      district: student.address?.district || "",
      state: student.address?.state || "",
      pincode: student.address?.pincode || "",
    });
  }, [student, navigate]);

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

    if (!student?._id) {
      return toast.error("Student ID missing");
    }

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

      const { data } = await axios.put(
        `${backendUrl}/api/student/${student._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (data.success) {
        toast.success("Student updated successfully");

        if (
          payload.status === "passed_out" ||
          payload.status === "dropped_out"
        ) {
          return navigate("/students");
        }

        navigate(-1);
      }
    } catch (error) {
      console.error("Update student error:", error);
      toast.error(error.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Update Student
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Edit student academic, personal and address details
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 md:p-6 space-y-6 md:space-y-8"
      >
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
          <h3 className="text-lg font-semibold mb-6">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Input
              label="Student Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Registration No"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

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

            <Input
              label="Aadhar Number"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
            />

            <Input
              label="PEN Number"
              name="pen"
              value={formData.pen}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              >
                <option value="current">Current</option>
                <option value="passed_out">Passed Out</option>
                <option value="dropped_out">Dropped Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
          <h3 className="text-lg font-semibold mb-6">Parent Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Input
              label="Father Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
            />

            <Input
              label="Mother Name"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
          <h3 className="text-lg font-semibold mb-6">Academic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
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

                    {STREAM_OPTIONS.map((stream) => (
                      <option key={stream} value={stream}>
                        {stream.charAt(0).toUpperCase() + stream.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
          <h3 className="text-lg font-semibold mb-6">Address Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Input
              label="Village"
              name="village"
              value={formData.village}
              onChange={handleChange}
            />

            <Input
              label="Post Office"
              name="postOffice"
              value={formData.postOffice}
              onChange={handleChange}
            />

            <Input
              label="Police Station"
              name="policeStation"
              value={formData.policeStation}
              onChange={handleChange}
            />

            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          loading={loading}
          className="w-full py-4"
        >
          {loading ? "Updating Student..." : "Update Student"}
        </Button>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
        required={required}
      />
    </div>
  );
};

export default UpdateStudent;
