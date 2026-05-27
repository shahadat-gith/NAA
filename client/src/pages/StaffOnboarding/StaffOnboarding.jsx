import React, { useState, useRef, useContext } from 'react';
import "./StaffOnboarding.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from '../../context/AppContext';
import CropModal from './CropModal';

const StaffOnboarding = () => {
  const { backendUrl } = useContext(AppContext);

  // Form Fields mapped to your final MongoDB schema
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  
  // Nested Address Block
  const [village, setVillage] = useState("");
  const [po, setPo] = useState("");
  const [ps, setPs] = useState("");
  const [pin, setPin] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Assam"); // Smart schema default

  // Academic Profile
  const [subjectTaught, setSubjectTaught] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  
  // Image Storage & CropModal Handlers
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // UX Handling
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  // Populated drop-downs matching your criteria
  const subjects = [
    "Mathematics", "Advanced Mathematics", "Physics", "Chemistry", "Biology",
    "Assamese", "Advance Assamese", "English", "Alternative English",
    "Geography", "Education", "Political Science", "History", "Arabic",
    "Social Studies", "Computer", "Garments Design", "Drawing",
    "Drawing/Handwriting", "General Science", "GK", "EVS", "Hindi", "Retail Management"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setFormError("Please select a valid image file.");
        return;
      }
      setFormError("");
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleCropSaveSuccess = (croppedFile, croppedPreviewUrl) => {
    setImageFile(croppedFile);
    setImagePreview(croppedPreviewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setFormError("");

    if (!imageFile) {
      setFormError("A profile photo is required to submit your onboarding profile.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setFormError("Please provide a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Basic Info appending
      formData.append("name", name);
      formData.append("email", email || "N/A");
      formData.append("contact", contact);
      formData.append("gender", gender);

      // Address structure object formatting expected by server parser
      const addressData = { village, po, ps, pin, district, state };
      formData.append("address", JSON.stringify(addressData));

      // Academics
      formData.append("subjectTaught", subjectTaught);
      formData.append("degree", degree);
      formData.append("experience", Number(experience));
      
      // File Asset
      formData.append("image", imageFile);

      const { data } = await axios.post(`${backendUrl}/api/teacher/apply-onboarding`, formData);

      if (data.success) {
        toast.success("Onboarding registration profile submitted successfully!");
        
        // Resetting local parameters cleanly
        setName(""); setEmail(""); setContact(""); setGender("");
        setVillage(""); setPo(""); setPs(""); setPin(""); setDistrict(""); setState("Assam");
        setSubjectTaught(""); setDegree(""); setExperience("");
        setImageFile(null); setImagePreview("");
      } else {
        setFormError(data.message || "Submission failed.");
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="so-onboarding-container">
      <div className="so-onboarding-card">
        
        <div className="so-header-section">
          <h1 className="so-title">Join Nashib Ali Academy</h1>
          <p className="so-subtitle">Fill up your application details to apply as an educator.</p>
        </div>

        {formError && <div className="so-error-alert">{formError}</div>}

        <form onSubmit={handleSubmit} className="so-form-wrapper">
          
          {/* IMAGE SECURE BLOCK */}
          <div className="so-image-upload-section">
            <div className="so-avatar-preview" onClick={() => fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Teacher profile preview" className="so-preview-img" />
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
              <button type="button" className="so-action-text-btn" onClick={() => fileInputRef.current.click()}>
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
                  Recrop Details
                </button>
              )}
            </div>
          </div>

          {/* BASIC USER GRID */}
          <div className="so-form-section-title">Personal Information</div>
          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
            </div>

            <div className="so-input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address (Optional)" />
            </div>

            <div className="so-input-group">
              <label>Contact Number *</label>
              <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" required />
            </div>

            <div className="so-input-group">
              <label>Gender *</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* RESIDENTIAL NESTED BLOCK */}
          <div className="so-form-section-title">Residential Address</div>
          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Village / Town *</label>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village or Town" required />
            </div>

            <div className="so-input-group">
              <label>Post Office (P.O.) *</label>
              <input type="text" value={po} onChange={(e) => setPo(e.target.value)} placeholder="Post Office" required />
            </div>

            <div className="so-input-group">
              <label>Police Station (P.S.) *</label>
              <input type="text" value={ps} onChange={(e) => setPs(e.target.value)} placeholder="Police Station" required />
            </div>

            <div className="so-input-group">
              <label>PIN Code *</label>
              <input type="text" maxLength={6} value={pin} onChange={(e) => /^\d*$/.test(e.target.value) && setPin(e.target.value)} placeholder="6-Digit PIN Code" required />
            </div>

            <div className="so-input-group">
              <label>District *</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Barpeta" required />
            </div>

            <div className="so-input-group">
              <label>State *</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Assam" required />
            </div>
          </div>

          {/* ACADEMIC INFRASTRUCTURE GRID */}
          <div className="so-form-section-title">Academic & Professional Credentials</div>
          <div className="so-form-grid">
            <div className="so-input-group">
              <label>Subject You Teach *</label>
              <select value={subjectTaught} onChange={(e) => setSubjectTaught(e.target.value)} required>
                <option value="">Select Subject</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="so-input-group">
              <label>Highest Qualification / Degree *</label>
              <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. M.A., M.Sc., B.Ed." required />
            </div>

            <div className="so-input-group">
              <label>Teaching Experience (Years) *</label>
              <input 
                type="number" 
                min="0"
                value={experience} 
                onChange={(e) => setExperience(e.target.value)} 
                placeholder="Years of Experience" 
                required 
              />
            </div>
          </div>

          {/* EXECUTE INTERFACE ACTION */}
          <button type="submit" disabled={loading} className="so-submit-application-btn">
            {loading ? (
              <>
                <span className="so-spinner"></span> Processing Application...
              </>
            ) : "Submit Application"}
          </button>
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