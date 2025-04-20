import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { FeeContext } from "../../context/FeeContext";
import "./AdmissionForm.css";

const AdmissionForm = () => {
  const { backendUrl } = useContext(AppContext);
  const { feeStructure } = useContext(FeeContext);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    aadhar: "",
    caste: "",
    gender: "",
    religion: "",
    medium: "",
    class: "",
    dob: "",
    fatherName: "",
    motherName: "",
    guardianContact: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    hostel: "No",
    transport: "No",
    parentsOccupation: "",
    admissionFee: 0,
    hostelAdmissionFee: 0,
    stream: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showStream, setShowStream] = useState(false);
  const totalSteps = 5;

  // Update class options based on medium
  useEffect(() => {
    let options = [];
    if (formData.medium === "assamese") {
      options = [
        { value: "ankur", label: "Ankur" },
        { value: "mukul", label: "Mukul" },
        ...Array.from({ length: 12 }, (_, i) => ({
          value: `${i + 1}`,
          label: `Class ${i + 1}`,
        })),
      ];
    } else if (formData.medium === "english") {
      options = [
        { value: "nursery", label: "Nursery" },
        { value: "kg", label: "KG" },
        ...Array.from({ length: 10 }, (_, i) => ({
          value: `${i + 1}`,
          label: `Class ${i + 1}`,
        })),
      ];
    }
    setClassOptions(options);

    if (formData.class) {
      const classExists = options.some((opt) => opt.value === formData.class);
      if (!classExists) {
        setFormData((prev) => ({
          ...prev,
          class: "",
          stream: "",
        }));
      }
    }
  }, [formData.medium]);

  // Check if stream should be shown
  useEffect(() => {
    setShowStream(formData.medium === "assamese" && ["11", "12"].includes(formData.class));
    if (!showStream && formData.stream) {
      setFormData((prev) => ({ ...prev, stream: "" }));
    }
  }, [formData.class, formData.medium]);

  // Calculate fees based on FeeContext
// Inside AdmissionForm.js
useEffect(() => {
  let admissionFee = 0;
  let hostelFee = 0;

  if (formData.medium && formData.class) {
    let category;
    let className;

    if (formData.medium === "assamese" && ["11", "12"].includes(formData.class)) {
      category = feeStructure.find((cat) => cat.category === "Higher Secondary");
      if (category && formData.stream) {
        const year = parseInt(formData.class) - 10; // Convert 11 to 1, 12 to 2
        className = `hs-${formData.stream.toLowerCase()}-${year}`;
      }
    } else {
      category = feeStructure.find((cat) => cat.category === formData.medium);
      if (category) {
        className = formData.class.toLowerCase(); // Use class value directly (e.g., "1", "nursery", "ankur")
      }
    }

    if (category) {
      const selectedClass = category.fees.find((fee) => fee.className === className);
      if (selectedClass) {
        admissionFee = selectedClass.amount;
      }
    }

    if (formData.hostel === "Yes") {
      const hostelCategory = feeStructure.find((cat) => cat.category === "Hostel Fees");
      if (hostelCategory) {
        const hostelFeeEntry = hostelCategory.fees.find((fee) => fee.className === "hostel");
        hostelFee = hostelFeeEntry ? hostelFeeEntry.amount : 0;
      }
    }
  }

  setFormData((prev) => ({
    ...prev,
    admissionFee,
    hostelAdmissionFee: hostelFee,
  }));
}, [formData.medium, formData.class, formData.hostel, formData.stream, feeStructure]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image (JPEG/JPG/PNG)");
      setImage(null);
      setImagePreview(null);
    }
  };

  const validateStep = (step) => {
    const requiredFields = {
      1: ["firstName", "lastName", "aadhar", "dob", "gender", "religion", "caste", "medium", "class"],
      2: ["fatherName", "motherName", "guardianContact", "phone", "parentsOccupation"],
      3: ["address", "district", "state", "pincode"],
      4: ["hostel", "transport"],
    };

    if (step === 1 && showStream && !formData.stream) {
      toast.error("Stream is required for Assamese medium Class 11 or 12");
      return false;
    }

    const fields = requiredFields[step] || [];
    for (const field of fields) {
      if (!formData[field] || formData[field].trim() === "") {
        toast.error(`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`);
        return false;
      }
    }

    if (step === 1) {
      if (!/^\d{12}$/.test(formData.aadhar)) {
        toast.error("Aadhaar must be a 12-digit number");
        return false;
      }
    }

    if (step === 2) {
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Phone must be a 10-digit number");
        return false;
      }
      if (!/^\d{10}$/.test(formData.guardianContact)) {
        toast.error("Guardian Contact must be a 10-digit number");
        return false;
      }
    }

    if (step === 3) {
      if (!/^\d{6}$/.test(formData.pincode)) {
        toast.error("PIN Code must be a 6-digit number");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;
  
    setLoading(true);
    const data = new FormData();
    const fields = [
      "firstName", "middleName", "lastName", "aadhar", "caste", "gender", "religion",
      "medium", "class", "dob", "fatherName", "motherName", "guardianContact", "phone",
      "address", "district", "state", "pincode", "hostel", "transport", "parentsOccupation",
      "admissionFee", "hostelAdmissionFee", "isNewAdmission", // Add isNewAdmission
    ];
  
    if (showStream) fields.push("stream");
  
    fields.forEach((field) => {
      data.append(field, field === "isNewAdmission" ? "true" : formData[field]); // Set isNewAdmission to true
    });
  
    if (image) data.append("image", image);
  
    try {
      const response = await fetch(`${backendUrl}/api/students/admission`, {
        method: "POST",
        body: data,
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success("Admission submitted successfully!");
        setFormData({
          firstName: "", middleName: "", lastName: "", aadhar: "", caste: "", gender: "", religion: "",
          medium: "", class: "", dob: "", fatherName: "", motherName: "", guardianContact: "",
          phone: "", address: "", district: "", state: "", pincode: "", hostel: "No",
          transport: "No", parentsOccupation: "", admissionFee: 0, hostelAdmissionFee: 0, stream: "",
        });
        setImage(null);
        setImagePreview(null);
        setCurrentStep(1);
  
        const { dueAmount, hostelDueAmount, studentId } = result.data;
        if (dueAmount > 0 || hostelDueAmount > 0) {
          toast.info(`Please complete payment: Admission ₹${dueAmount}, Hostel ₹${hostelDueAmount}`);
          // Optionally redirect to payment page: window.location.href = `/payment/${studentId}`;
        }
      } else {
        toast.error(result.message || "Failed to submit admission");
      }
    } catch (error) {
      console.error("Error submitting admission:", error);
      toast.error("Error submitting admission");
    } finally {
      setLoading(false);
    }
  };
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="progress-step-container">
            <div
              className={`progress-step ${step <= currentStep ? "active" : ""}`}
              onClick={() => validateStep(currentStep) && setCurrentStep(step)}
            >
              {step}
            </div>
            <div className="step-label">
              {step === 1 && "Student Info"}
              {step === 2 && "Parent Info"}
              {step === 3 && "Address"}
              {step === 4 && "Additional"}
              {step === 5 && "Review"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStudentInfo = () => {
    return (
      <div className="form-section">
        <h3 className="section-header">Student Information</h3>
        <div className="grid-container">
          <div className="input-group">
            <label>First Name <span className="required">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter first name"
            />
          </div>
          <div className="input-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Enter middle name (optional)"
            />
          </div>
          <div className="input-group">
            <label>Last Name <span className="required">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter last name"
            />
          </div>
          <div className="input-group">
            <label>Aadhaar <span className="required">*</span></label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              required
              pattern="\d{12}"
              title="Please enter a 12-digit Aadhaar number"
              placeholder="Enter 12-digit Aadhaar"
            />
          </div>
          <div className="input-group">
            <label>Date of Birth <span className="required">*</span></label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Gender <span className="required">*</span></label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Religion <span className="required">*</span></label>
            <select name="religion" value={formData.religion} onChange={handleChange} required>
              <option value="">Select Religion</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Christianity">Christianity</option>
              <option value="Sikhism">Sikhism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Jainism">Jainism</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Caste <span className="required">*</span></label>
            <select name="caste" value={formData.caste} onChange={handleChange} required>
              <option value="">Select Caste</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
          <div className="input-group">
            <label>Medium <span className="required">*</span></label>
            <select name="medium" value={formData.medium} onChange={handleChange} required>
              <option value="">Select Medium</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>
          </div>
          <div className="input-group">
            <label>Class <span className="required">*</span></label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
              disabled={!formData.medium}
            >
              <option value="">Select Class</option>
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {showStream && (
            <div className="input-group">
              <label>Stream <span className="required">*</span></label>
              <select name="stream" value={formData.stream} onChange={handleChange} required>
                <option value="">Select Stream</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderParentInfo = () => {
    return (
      <div className="form-section">
        <h3 className="section-header">Parent/Guardian Information</h3>
        <div className="grid-container">
          <div className="input-group">
            <label>Father's Name <span className="required">*</span></label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              placeholder="Enter father's name"
            />
          </div>
          <div className="input-group">
            <label>Mother's Name <span className="required">*</span></label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              required
              placeholder="Enter mother's name"
            />
          </div>
          <div className="input-group">
            <label>Guardian Contact No. <span className="required">*</span></label>
            <input
              type="text"
              name="guardianContact"
              value={formData.guardianContact}
              onChange={handleChange}
              required
              pattern="\d{10}"
              title="Please enter a 10-digit phone number"
              placeholder="Enter 10-digit mobile number"
            />
          </div>
          <div className="input-group">
            <label>Phone No. <span className="required">*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="\d{10}"
              title="Please enter a 10-digit phone number"
              placeholder="Enter 10-digit phone number"
            />
          </div>
          <div className="input-group">
            <label>Parents Occupation <span className="required">*</span></label>
            <input
              type="text"
              name="parentsOccupation"
              value={formData.parentsOccupation}
              onChange={handleChange}
              required
              placeholder="Enter parents' occupation"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAddressInfo = () => {
    return (
      <div className="form-section">
        <h3 className="section-header">Address Information</h3>
        <div className="grid-container">
          <div className="input-group full-width">
            <label>Address <span className="required">*</span></label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter full address"
            />
          </div>
          <div className="input-group">
            <label>District <span className="required">*</span></label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              placeholder="Enter district"
            />
          </div>
          <div className="input-group">
            <label>State <span className="required">*</span></label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
            />
          </div>
          <div className="input-group">
            <label>PIN Code <span className="required">*</span></label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              pattern="\d{6}"
              title="Please enter a 6-digit PIN code"
              placeholder="Enter 6-digit PIN code"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <div className="form-section">
        <h3 className="section-header">Additional Information</h3>
        <div className="grid-container">
          <div className="input-group">
            <label>Hostel Facilities <span className="required">*</span></label>
            <select name="hostel" value={formData.hostel} onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="input-group">
            <label>Transport Facilities <span className="required">*</span></label>
            <select name="transport" value={formData.transport} onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="input-group">
            <label>Student Photo</label>
            <div className="file-upload-container">
              <input
                type="file"
                className="file-input"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="file-upload-label">Choose File</label>
              <span className="file-name">{image ? image.name : "No file chosen"}</span>
            </div>
          </div>
          {imagePreview && (
            <div className="input-group">
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReviewInfo = () => {
    return (
      <div className="form-section">
        <h3 className="section-header">Review Information</h3>
        <div className="review-container">
          <div className="review-section">
            <h4>Student Details</h4>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">{`${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Aadhaar:</span>
                <span className="review-value">{formData.aadhar}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Gender:</span>
                <span className="review-value">{formData.gender}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Date of Birth:</span>
                <span className="review-value">{formData.dob}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Religion/Caste:</span>
                <span className="review-value">{`${formData.religion} / ${formData.caste}`}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Medium:</span>
                <span className="review-value">{formData.medium}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Class:</span>
                <span className="review-value">
                  {formData.class ? classOptions.find((opt) => opt.value === formData.class)?.label || formData.class : ""}
                </span>
              </div>
              {showStream && (
                <div className="review-item">
                  <span className="review-label">Stream:</span>
                  <span className="review-value">{formData.stream}</span>
                </div>
              )}
            </div>
          </div>

          <div className="review-section">
            <h4>Parent/Guardian Details</h4>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">Father's Name:</span>
                <span className="review-value">{formData.fatherName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Mother's Name:</span>
                <span className="review-value">{formData.motherName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Guardian Contact:</span>
                <span className="review-value">{formData.guardianContact}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Phone:</span>
                <span className="review-value">{formData.phone}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Parents Occupation:</span>
                <span className="review-value">{formData.parentsOccupation}</span>
              </div>
            </div>
          </div>

          <div className="review-section">
            <h4>Address Details</h4>
            <div className="review-grid">
              <div className="review-item full-width">
                <span className="review-label">Address:</span>
                <span className="review-value">{formData.address}</span>
              </div>
              <div className="review-item">
                <span className="review-label">District:</span>
                <span className="review-value">{formData.district}</span>
              </div>
              <div className="review-item">
                <span className="review-label">State:</span>
                <span className="review-value">{formData.state}</span>
              </div>
              <div className="review-item">
                <span className="review-label">PIN Code:</span>
                <span className="review-value">{formData.pincode}</span>
              </div>
            </div>
          </div>

          <div className="review-section">
            <h4>Fee Details</h4>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">Admission Fee:</span>
                <span className="review-value">₹{formData.admissionFee}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Hostel Fee:</span>
                <span className="review-value">₹{formData.hostelAdmissionFee}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Total Fee:</span>
                <span className="review-value fee-total">₹{formData.admissionFee + formData.hostelAdmissionFee}</span>
              </div>
            </div>
          </div>

          <div className="review-section">
            <h4>Additional Details</h4>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">Hostel Required:</span>
                <span className="review-value">{formData.hostel}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Transport Required:</span>
                <span className="review-value">{formData.transport}</span>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="review-section">
              <h4>Student Photo</h4>
              <div className="review-photo">
                <img src={imagePreview} alt="Student" className="student-photo" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admission-form-container">
      <div className="form-header">
        <h2>Admission Form - Nashib Ali Academy</h2>
        <p>
          Please fill out all required fields marked with <span className="required">*</span>
        </p>
      </div>

      {renderProgressBar()}

      <form onSubmit={handleSubmit}>
        <div className="form-content">
          {currentStep === 1 && renderStudentInfo()}
          {currentStep === 2 && renderParentInfo()}
          {currentStep === 3 && renderAddressInfo()}
          {currentStep === 4 && renderAdditionalInfo()}
          {currentStep === 5 && renderReviewInfo()}
        </div>

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" className="btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {currentStep < totalSteps && (
            <button type="button" className="btn-primary" onClick={nextStep}>
              Next
            </button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;