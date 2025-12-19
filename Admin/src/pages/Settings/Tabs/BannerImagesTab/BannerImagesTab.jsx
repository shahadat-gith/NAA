import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import EditBannerModal from "./EditBannerModal";
import "./BannerImagesTab.css";

const MAX_IMAGES = 12;

const BannerImagesTab = () => {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const { backendUrl } = useContext(AdminContext);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/settings/hero-images`
      );

      if (res.data.success) {
        setImages(res.data.data);
      }
    } catch {
      toast.error("Failed to load banner images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  return (
    <div className="banner-container">
      <div className="banner-header">
        <h2 className="banner-title">
          <i className="fas fa-images"></i> Banner Images
        </h2>

        <button
          className="banner-add-btn"
          disabled={images.length >= MAX_IMAGES}
          onClick={() => images.length < MAX_IMAGES && setIsAddMode(true)}
        >
          <i className="fas fa-plus"></i> Add Image
        </button>
      </div>

      {loading ? (
        <div className="banner-loading">Loading banner images...</div>
      ) : (
        <div className="banner-grid">
          {images.map((img) => (
            <div key={img._id} className="banner-card">
              <button
                className="banner-edit-icon"
                onClick={() => setEditingImage(img)}
              >
                <i className="fas fa-edit"></i>
              </button>

              <img src={img.url} alt="Banner" className="banner-image" />
            </div>
          ))}
        </div>
      )}

      <EditBannerModal
        open={!!editingImage || isAddMode}
        image={editingImage}
        isAddMode={isAddMode}
        onClose={() => {
          setEditingImage(null);
          setIsAddMode(false);
        }}
        onSuccess={fetchHeroImages}
      />
    </div>
  );
};

export default BannerImagesTab;
