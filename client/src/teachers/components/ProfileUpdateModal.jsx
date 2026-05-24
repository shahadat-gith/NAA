import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import "../styles/ProfileUpdateModal.css";

const ProfileUpdateModal = ({isOpen,onClose,teacherData,onUpdateSuccess}) => {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("teacher-token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    degree: "",
    experience: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* Crop States */
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    if (isOpen && teacherData) {
      setForm({
        name: teacherData.name || "",
        email:
          teacherData.email && teacherData.email !== "N/A"
            ? teacherData.email
            : "",
        contact: teacherData.contact || "",
        degree: teacherData.degree || "",
        experience:
          teacherData.experience !== undefined ? teacherData.experience : "",
      });

      setImagePreview(teacherData.image || "");
      setImageFile(null);
    }
  }, [isOpen, teacherData]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setShowCropModal(true);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = new Image();

    // CRITICAL: Enable CORS mapping for remote images (like Cloudinary)
    // This must be set BEFORE defining the image src
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(
          new Error(
            "Failed to load image asset for cropping. Check CORS configuration.",
          ),
        );
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped-profile.jpg", {
          type: "image/jpeg",
        });

        resolve({
          file: croppedFile,
          preview: URL.createObjectURL(blob),
        });
      }, "image/jpeg");
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);

      setImageFile(croppedImage.file);
      setImagePreview(croppedImage.preview);

      setShowCropModal(false);
    } catch (e) {
      console.log(e)
      toast.error("Failed to crop image");
    }
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  setLoading(true);

  try {
    const formData = new FormData();

    // Send only changed fields

    if (form.name !== teacherData.name) {
      formData.append("name", form.name);
    }

    if (
      form.email !==
      (teacherData.email === "N/A" ? "" : teacherData.email)
    ) {
      formData.append("email", form.email || "N/A");
    }

    if (form.contact !== teacherData.contact) {
      formData.append("contact", form.contact);
    }

    if (form.degree !== teacherData.degree) {
      formData.append("degree", form.degree);
    }

    if (
      Number(form.experience) !==
      Number(teacherData.experience)
    ) {
      formData.append(
        "experience",
        Number(form.experience)
      );
    }

    // image optional

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Nothing changed

    if ([...formData.entries()].length === 0) {
      toast.error("No changes detected");
      setLoading(false);
      return;
    }

    const response = await axios.put(
      `${backendUrl}/api/teacher/update-teacher/${teacherData._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.success) {
      toast.success(response.data.message || "Profile updated successfully!");

      onUpdateSuccess(response.data.teacher);
      onClose();
    } else {
      toast.error(response.data?.message || "Failed to update profile.");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "An error occurred while saving profile changes.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="teacher-modal-backdrop" onClick={onClose}>
        <div
          className="teacher-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}

          <div className="teacher-modal-header">
            <h2>Update Profile Details</h2>

            <button
              type="button"
              className="teacher-modal-close-btn"
              onClick={onClose}
              disabled={loading}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="teacher-modal-form">
            {/* Avatar */}

            <div className="teacher-modal-avatar-uploader">
              <div className="teacher-modal-avatar-frame">
                <img
                  src={imagePreview || "/logo.png"}
                  alt="Preview Avatar"
                  className="teacher-modal-avatar-img"
                />
              </div>

              <div className="teacher-avatar-actions">
                <label className="teacher-upload-btn">
                  {imageFile ? "Change Photo" : "Upload Photo"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    hidden
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    className="teacher-crop-btn"
                    onClick={() => {
                      setTempImage(imagePreview);
                      setShowCropModal(true);
                    }}
                  >
                    Crop Photo
                  </button>
                )}
              </div>
            </div>

            {/* Inputs */}

            <div className="teacher-modal-inputs-grid">
              <label className="teacher-form-label">
                Full Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>

              <label className="teacher-form-label">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>

              <label className="teacher-form-label">
                Contact Number
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>

              <label className="teacher-form-label">
                Academic Degree Credentials
                <input
                  type="text"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>

              <label className="teacher-form-label">
                Teaching Experience (Years)
                <input
                  type="number"
                  min="0"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>
            </div>

            {/* Actions */}

            <div className="teacher-modal-actions">
              <button
                type="button"
                className="teacher-button-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="teacher-button-primary"
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Updates"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modal */}

      {showCropModal && (
        <div className="crop-modal-backdrop">
          <div className="crop-modal-card">
            <div className="crop-container">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="crop-controls">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />

              <div className="crop-buttons">
                <button
                  type="button"
                  className="teacher-button-secondary"
                  onClick={() => setShowCropModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="teacher-button-primary"
                  onClick={handleCropSave}
                >
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileUpdateModal;
