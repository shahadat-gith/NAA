import React, { useState, useRef, useContext } from "react";
import "./StaffOnboarding.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import CropModal from "./CropModal";

import { subjects, designationsByRole } from "./utils";

const StaffOnboarding = () => {
  const { backendUrl } = useContext(AppContext);

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
  const [fieldErrors, setFieldErrors] = useState({});

  const fileInputRef = useRef(null);

  const setFieldError = (field, message) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const hasError = (field) => (fieldErrors[field] ? "so-input-error" : "");

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
    setShowCropModal(false);
    setFormError("");
    setFieldErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    clearFieldError("image");
    setFormError("");

    if (!file.type.startsWith("image/")) {
      setFieldError("image", "Please select a valid image file.");
      e.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setTempImage(imageUrl);
    setShowCropModal(true);

    e.target.value = "";
  };

  const handleCropSaveSuccess = (croppedFile, croppedPreviewUrl) => {
    setImageFile(croppedFile);
    setImagePreview(croppedPreviewUrl);
    setShowCropModal(false);
    setTempImage(null);
    clearFieldError("image");
    setFormError("");
  };

  const validateForm = () => {
    const errors = {};

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

    if (!staffType) errors.staffType = "Please select staff category.";
    if (!designation) errors.designation = "Please select designation.";

    if (!trimmedName) errors.name = "Full name is required.";

    if (!trimmedEmail) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!trimmedContact) {
      errors.contact = "Contact number is required.";
    } else if (!/^[6-9]\d{9}$/.test(trimmedContact)) {
      errors.contact =
        "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }

    if (!gender) errors.gender = "Please select gender.";

    if (!trimmedVillage) errors.village = "Village / town is required.";
    if (!trimmedPo) errors.po = "Post office is required.";
    if (!trimmedPs) errors.ps = "Police station is required.";

    if (!trimmedPin) {
      errors.pin = "PIN code is required.";
    } else if (!/^\d{6}$/.test(trimmedPin)) {
      errors.pin = "Please provide a valid 6-digit PIN code.";
    }

    if (!trimmedDistrict) errors.district = "District is required.";
    if (!trimmedState) errors.state = "State is required.";

    if (!trimmedQualification) {
      errors.qualification = "Highest qualification is required.";
    }

    if (experience !== "" && Number(experience) < 0) {
      errors.experience = "Experience cannot be negative.";
    }

    if (staffType === "Teaching" && !trimmedSubject) {
      errors.subjectTaught = "Subject taught is required for teaching staff.";
    }

    if (!imageFile) {
      errors.image = "A profile photo is required.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

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
        })
      );

      formData.append("qualification", trimmedQualification);
      formData.append("experience", Number(experience) || 0);

      if (staffType === "Teaching") {
        formData.append("subjectTaught", trimmedSubject);
      } else {
        formData.append("subjectTaught", "");
      }

      formData.append("image", imageFile);

      await axios.post(
        `${backendUrl}/api/staff/register`,
        formData
      );

      toast.success("Staff registration submitted successfully.");
      resetForm();
      window.location.replace("https://staff.nashibaliacademy.in/?source=main-site");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "An error occurred during submission.";

      setFormError(backendMessage);
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

        <form onSubmit={handleSubmit} className="so-form-wrapper" noValidate>
          <div className="so-image-upload-section">
            <div
              className={`so-avatar-preview ${
                fieldErrors.image ? "so-avatar-error" : ""
              }`}
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

            {fieldErrors.image && (
              <p className="so-field-error so-image-error">
                {fieldErrors.image}
              </p>
            )}
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
                  clearFieldError("staffType");
                  clearFieldError("designation");
                  clearFieldError("subjectTaught");
                  setFormError("");
                }}
                className={hasError("staffType")}
              >
                <option value="">Select Category</option>
                <option value="Teaching">Teaching Staff</option>
                <option value="Non-Teaching">Non-Teaching Staff</option>
              </select>
              {fieldErrors.staffType && (
                <p className="so-field-error">{fieldErrors.staffType}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Designation *</label>
              <select
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  clearFieldError("designation");
                  setFormError("");
                }}
                disabled={!staffType}
                className={hasError("designation")}
              >
                <option value="">Select Designation</option>
                {staffType &&
                  designationsByRole?.[staffType]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
              {fieldErrors.designation && (
                <p className="so-field-error">{fieldErrors.designation}</p>
              )}
            </div>
          </div>

          <div className="so-form-section-title">Personal Information</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                  setFormError("");
                }}
                placeholder="Full Name"
                className={hasError("name")}
              />
              {fieldErrors.name && (
                <p className="so-field-error">{fieldErrors.name}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                  setFormError("");
                }}
                placeholder="Email Address"
                className={hasError("email")}
              />
              {fieldErrors.email && (
                <p className="so-field-error">{fieldErrors.email}</p>
              )}
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

                    if (!value.trim()) {
                      setFieldError("contact", "Contact number is required.");
                    } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
                      setFieldError(
                        "contact",
                        "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9."
                      );
                    } else {
                      clearFieldError("contact");
                    }

                    setFormError("");
                  }
                }}
                placeholder="10-digit Mobile Number"
                className={hasError("contact")}
              />
              {fieldErrors.contact && (
                <p className="so-field-error">{fieldErrors.contact}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Gender *</label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  clearFieldError("gender");
                  setFormError("");
                }}
                className={hasError("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.gender && (
                <p className="so-field-error">{fieldErrors.gender}</p>
              )}
            </div>
          </div>

          <div className="so-form-section-title">Residential Address</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Village / Town *</label>
              <input
                type="text"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  clearFieldError("village");
                  setFormError("");
                }}
                placeholder="Village or Town"
                className={hasError("village")}
              />
              {fieldErrors.village && (
                <p className="so-field-error">{fieldErrors.village}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Post Office (P.O.) *</label>
              <input
                type="text"
                value={po}
                onChange={(e) => {
                  setPo(e.target.value);
                  clearFieldError("po");
                  setFormError("");
                }}
                placeholder="Post Office"
                className={hasError("po")}
              />
              {fieldErrors.po && (
                <p className="so-field-error">{fieldErrors.po}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Police Station (P.S.) *</label>
              <input
                type="text"
                value={ps}
                onChange={(e) => {
                  setPs(e.target.value);
                  clearFieldError("ps");
                  setFormError("");
                }}
                placeholder="Police Station"
                className={hasError("ps")}
              />
              {fieldErrors.ps && (
                <p className="so-field-error">{fieldErrors.ps}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    setPin(value);

                    if (!value.trim()) {
                      setFieldError("pin", "PIN code is required.");
                    } else if (!/^\d{6}$/.test(value.trim())) {
                      setFieldError(
                        "pin",
                        "Please provide a valid 6-digit PIN code."
                      );
                    } else {
                      clearFieldError("pin");
                    }

                    setFormError("");
                  }
                }}
                placeholder="6-Digit PIN Code"
                className={hasError("pin")}
              />
              {fieldErrors.pin && (
                <p className="so-field-error">{fieldErrors.pin}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>District *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  clearFieldError("district");
                  setFormError("");
                }}
                placeholder="e.g. Barpeta"
                className={hasError("district")}
              />
              {fieldErrors.district && (
                <p className="so-field-error">{fieldErrors.district}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  clearFieldError("state");
                  setFormError("");
                }}
                placeholder="Assam"
                className={hasError("state")}
              />
              {fieldErrors.state && (
                <p className="so-field-error">{fieldErrors.state}</p>
              )}
            </div>
          </div>

          <div className="so-form-section-title">Professional Credentials</div>

          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Highest Qualification *</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => {
                  setQualification(e.target.value);
                  clearFieldError("qualification");
                  setFormError("");
                }}
                placeholder="e.g. M.A., M.Sc., MCA"
                className={hasError("qualification")}
              />
              {fieldErrors.qualification && (
                <p className="so-field-error">{fieldErrors.qualification}</p>
              )}
            </div>

            <div className="so-input-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  clearFieldError("experience");
                  setFormError("");
                }}
                placeholder="Years of Experience"
                className={hasError("experience")}
              />
              {fieldErrors.experience && (
                <p className="so-field-error">{fieldErrors.experience}</p>
              )}
            </div>

            {staffType === "Teaching" && (
              <div className="so-input-group">
                <label>Subject You Teach *</label>
                <select
                  value={subjectTaught}
                  onChange={(e) => {
                    setSubjectTaught(e.target.value);
                    clearFieldError("subjectTaught");
                    setFormError("");
                  }}
                  className={hasError("subjectTaught")}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {fieldErrors.subjectTaught && (
                  <p className="so-field-error">
                    {fieldErrors.subjectTaught}
                  </p>
                )}
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
        onClose={() => {
          setShowCropModal(false);
          setTempImage(null);
        }}
        onCropSave={handleCropSaveSuccess}
      />
    </div>
  );
};

export default StaffOnboarding;