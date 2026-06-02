import React, { useState, useRef, useContext } from "react";
import "./StaffOnboarding.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CropModal from "./CropModal";

import { subjects, designationsByRole } from "./utils";

const StaffOnboarding = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [staffType, setStaffType] = useState("");
  const [designation, setDesignation] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  const [village, setVillage] = useState("");
  const [po, setPo] = useState("");
  const [ps, setPs] = useState("");
  const [pin, setPin] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Assam");

  const [subjectTaught, setSubjectTaught] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setStaffType("");
    setDesignation("");
    setName("");
    setEmail("");
    setContact("");
    setGender("");

    setVillage("");
    setPo("");
    setPs("");
    setPin("");
    setDistrict("");
    setState("Assam");

    setSubjectTaught("");
    setQualification("");
    setExperience("");

    setImageFile(null);
    setImagePreview("");
    setTempImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(contact.trim())) {
      setFormError(
        "Please enter a valid 10-digit mobile number without country code or leading zero.",
      );
      return;
    }

    setFormError("");

    const imageUrl = URL.createObjectURL(file);
    setTempImage(imageUrl);
    setShowCropModal(true);
  };

  const handleCropSaveSuccess = (croppedFile, croppedPreviewUrl) => {
    setImageFile(croppedFile);
    setImagePreview(croppedPreviewUrl);
    setShowCropModal(false);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setFormError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedContact = contact.trim();
    const trimmedVillage = village.trim();
    const trimmedPo = po.trim();
    const trimmedPs = ps.trim();
    const trimmedPin = pin.trim();
    const trimmedDistrict = district.trim();
    const trimmedState = state.trim();
    const trimmedQualification = qualification.trim();
    const trimmedSubject = subjectTaught.trim();

    if (!staffType) {
      setFormError("Please select staff category.");
      return;
    }

    if (!designation) {
      setFormError("Please select designation.");
      return;
    }

    if (!trimmedName || !trimmedEmail || !trimmedContact || !gender) {
      setFormError("Please fill all personal information fields.");
      return;
    }

    if (
      !trimmedVillage ||
      !trimmedPo ||
      !trimmedPs ||
      !trimmedPin ||
      !trimmedDistrict ||
      !trimmedState
    ) {
      setFormError("Please fill all address fields.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedPin)) {
      setFormError("Please provide a valid 6-digit PIN code.");
      return;
    }

    if (!trimmedQualification) {
      setFormError("Please enter highest qualification.");
      return;
    }

    if (Number(experience) < 0) {
      setFormError("Experience cannot be negative.");
      return;
    }

    if (staffType === "Teaching" && !trimmedSubject) {
      setFormError("Subject taught is required for teaching staff.");
      return;
    }

    if (!imageFile) {
      setFormError(
        "A profile photo is required to submit your onboarding profile.",
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("staffType", staffType);
      formData.append("designation", designation);
      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("contact", trimmedContact);
      formData.append("gender", gender);

      formData.append(
        "address",
        JSON.stringify({
          village: trimmedVillage,
          po: trimmedPo,
          ps: trimmedPs,
          pin: trimmedPin,
          district: trimmedDistrict,
          state: trimmedState,
        }),
      );

      formData.append("qualification", trimmedQualification);
      formData.append("experience", Number(experience) || 0);

      if (staffType === "Teaching") {
        formData.append("subjectTaught", trimmedSubject);
      } else {
        formData.append("subjectTaught", "");
      }

      formData.append("image", imageFile);

      for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

      const { data } = await axios.post(`${backendUrl}/api/staff/register`,formData,

      );

      

      toast.success(
        data?.message || "Staff registration submitted successfully.",
      );

      resetForm();

      navigate("/teacher");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "An error occurred during submission.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="so-onboarding-container">
      <div className="so-onboarding-card">
        <div className="so-header-section">
          <h1 className="so-title">Join Nashib Ali Academy</h1>
          <p className="so-subtitle">
            Fill up your application details to apply as a staff member or
            educator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="so-form-wrapper">
          <div className="so-image-upload-section">
            <div
              className="so-avatar-preview"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Staff profile preview"
                  className="so-preview-img"
                />
              ) : (
                <div className="so-upload-placeholder">
                  <i className="fas fa-camera"></i>
                  <span>Upload Photo</span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="so-hidden-file-input"
            />

            <div className="so-avatar-actions">
              <button
                type="button"
                className="so-action-text-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {imageFile ? "Change Photo" : "Select Photo"}
              </button>

              {imagePreview && (
                <button
                  type="button"
                  className="so-action-text-btn so-crop-trigger"
                  onClick={() => {
                    setTempImage(imagePreview);
                    setShowCropModal(true);
                  }}
                >
                  Recrop Photo
                </button>
              )}
            </div>
          </div>

          <div className="so-form-section-title">Employment Role</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Staff Category *</label>
              <select
                value={staffType}
                onChange={(e) => {
                  setStaffType(e.target.value);
                  setDesignation("");
                  setSubjectTaught("");
                  setFormError("");
                }}
                required
              >
                <option value="">Select Category</option>
                <option value="Teaching">Teaching Staff</option>
                <option value="Non Teaching">Non-Teaching Staff</option>
              </select>
            </div>

            <div className="so-input-group">
              <label>Designation *</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                disabled={!staffType}
                required
              >
                <option value="">Select Designation</option>
                {staffType &&
                  designationsByRole?.[staffType]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="so-form-section-title">Personal Information</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                maxLength={10}
                value={contact}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    setContact(value);
                  }
                }}
                placeholder="10-digit Mobile Number"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="so-form-section-title">Residential Address</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Village / Town *</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village or Town"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Post Office (P.O.) *</label>
              <input
                type="text"
                value={po}
                onChange={(e) => setPo(e.target.value)}
                placeholder="Post Office"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Police Station (P.S.) *</label>
              <input
                type="text"
                value={ps}
                onChange={(e) => setPs(e.target.value)}
                placeholder="Police Station"
                required
              />
            </div>

            <div className="so-input-group">
              <label>PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setPin(e.target.value);
                  }
                }}
                placeholder="6-Digit PIN Code"
                required
              />
            </div>

            <div className="so-input-group">
              <label>District *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Barpeta"
                required
              />
            </div>

            <div className="so-input-group">
              <label>State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Assam"
                required
              />
            </div>
          </div>

          <div className="so-form-section-title">Professional Credentials</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Highest Qualification *</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. M.A., M.Sc., MCA"
                required
              />
            </div>

            <div className="so-input-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Years of Experience"
              />
            </div>

            {staffType === "Teaching" && (
              <div className="so-input-group">
                <label>Subject You Teach *</label>
                <select
                  value={subjectTaught}
                  onChange={(e) => setSubjectTaught(e.target.value)}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="so-submit-application-btn"
          >
            {loading ? (
              <>
                <span className="so-spinner"></span> Processing Application...
              </>
            ) : (
              "Submit Application"
            )}
          </button>

          {formError && <div className="so-error-alert">{formError}</div>}
        </form>
      </div>

      <CropModal
        isOpen={showCropModal}
        imageSrc={tempImage}
        onClose={() => setShowCropModal(false)}
        onCropSave={handleCropSaveSuccess}
      />
    </div>
  );
};

export default StaffOnboarding;
