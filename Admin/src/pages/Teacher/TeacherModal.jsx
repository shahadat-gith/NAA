import React, { useState, useRef, useContext, useEffect } from "react";
import "./TeacherModal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../context/AdminContext";

const TeacherModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  // --- Form States mapped to final database schema ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  // Residential Address Object Block
  const [village, setVillage] = useState("");
  const [po, setPo] = useState("");
  const [ps, setPs] = useState("");
  const [pin, setPin] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Assam"); // Default fallback schema matching token

  // Academic Credentials
  const [subjectTaught, setSubjectTaught] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  
  // Asset Management
  const [teacherImage, setTeacherImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // UX Lifecycle Hooks
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  const subjects = [
    "Mathematics", "Advanced Mathematics", "Physics", "Chemistry", "Biology",
    "Assamese", "Advance Assamese", "English", "Alternative English",
    "Geography", "Education", "Political Science", "History", "Arabic",
    "Social Studies", "Computer", "Garments Design", "Drawing",
    "Drawing/Handwriting", "General Science", "GK", "EVS", "Hindi", "Retail Management"
  ];

  /* ================= IMAGE CAPTURE HANDLERS ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file.");
      return;
    }
    setFormError("");
    setTeacherImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT DATA ACTION ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setFormError("");

    if (!teacherImage) {
      setFormError("Teacher profile picture asset attachment is mandatory.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setFormError("Please supply a structurally complete 6-digit PIN code layout.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Basic Info Packets
      formData.append("name", name);
      formData.append("email", email || "N/A");
      formData.append("contact", contact);
      formData.append("gender", gender);

      // Address elements packed securely to avoid FormData payload parsing drops
      const addressData = { village, po, ps, pin, district, state };
      formData.append("address", JSON.stringify(addressData));

      // Academics Parameters
      formData.append("subjectTaught", subjectTaught);
      formData.append("degree", degree);
      formData.append("experience", Number(experience));
      
      // Binary Media
      formData.append("image", teacherImage);

      const { data } = await axios.post(
        `${backendUrl}/api/teacher/add-teacher`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Teacher account created successfully!");
        
        // Comprehensive Local Variable Cleanup Form Sweep
        setName(""); setEmail(""); setContact(""); setGender("");
        setVillage(""); setPo(""); setPs(""); setPin(""); setDistrict(""); setState("Assam");
        setSubjectTaught(""); setDegree(""); setExperience("");
        setTeacherImage(null); setImagePreview("");
        
        onClose();
      } else {
        setFormError(data.message || "Failed to create teacher entry record.");
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "An administrative routing server error popped up.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SCROLL LAYOUT CONTROL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="tm-teacher-modal-overlay" onClick={onClose}>
      <div
        className="tm-teacher-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tm-modal-header">
          <h2>Add New Teacher Profile</h2>
          <button onClick={onClose} className="tm-close-button" disabled={loading}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="tm-teacher-form">
          {formError && <div className="tm-form-error">{formError}</div>}
          
          {/* IMAGE PREVIEW COMPONENT */}
          <div className="tm-media-upload-center">
            <div className="tm-avatar-box" onClick={() => !loading && fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Portrait preview" className="tm-img-preview-tag" />
              ) : (
                <div className="tm-camera-icon-wrapper">
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageChange} 
              hidden 
              disabled={loading}
            />
            <p className="tm-media-subtext">JPEG, PNG up to 5MB (Required)</p>
          </div>

          {/* SECTION I: PERSONAL DETAILS */}
          <div className="tm-section-separator-title">Personal Data</div>
          <div className="tm-form-grid">
            <div className="tm-input-group">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Identity Name *" required disabled={loading} />
            </div>
            <div className="tm-input-group">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" disabled={loading} />
            </div>
            <div className="tm-input-group">
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Active Contact Number *" required disabled={loading} />
            </div>
            <div className="tm-input-group">
              <select value={gender} onChange={(e) => setGender(e.target.value)} required disabled={loading}>
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* SECTION II: RESIDENTIAL ADDRESS  */}
          <div className="tm-section-separator-title">Address Details</div>
          <div className="tm-form-grid tm-grid-three-cols">
            <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village / Town *" required disabled={loading} />
            <input value={po} onChange={(e) => setPo(e.target.value)} placeholder="Post Office (P.O.) *" required disabled={loading} />
            <input value={ps} onChange={(e) => setPs(e.target.value)} placeholder="Police Station (P.S.) *" required disabled={loading} />
            <input value={pin} maxLength={6} onChange={(e) => /^\d*$/.test(e.target.value) && setPin(e.target.value)} placeholder="6-Digit PIN Code *" required disabled={loading} />
            <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District *" required disabled={loading} />
            <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State Default" required disabled={loading} />
          </div>

          {/* SECTION III: EDUCATION & DEPARTMENTS */}
          <div className="tm-section-separator-title">Academic Details</div>
          <div className="tm-form-grid">
            <div className="tm-input-group">
              <select value={subjectTaught} onChange={(e) => setSubjectTaught(e.target.value)} required disabled={loading}>
                <option value="">Select Subject *</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="tm-input-group">
              <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Qualification / Degrees *" required disabled={loading} />
            </div>
            <div className="tm-input-group tm-grid-full-width">
              <input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Teaching Experience (Total Years) *" required disabled={loading} />
            </div>
          </div>

          {/* EXECUTE OPERATION CONTROL BAR */}
          <div className="tm-action-footer-row">
            <button type="button" onClick={onClose} className="tm-cancel-action-btn" disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="tm-submit-btn">
              {loading ? "Submitting..." : "Submit Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TeacherModal;