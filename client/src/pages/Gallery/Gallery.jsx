import React, { useState, useContext, useEffect } from "react";
import "./Gallery.css";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const Gallery = () => {
  const { backendUrl } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [visibleCount, setVisibleCount] = useState(8);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/gallery`);
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, images.length));
  };

  const visibleImages = images.slice(0, visibleCount);


  return (
    <div className="gl-gallery-page">
      <Helmet>
        <title>Gallery | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore photos and highlights of academic activities, events, classrooms and student life at Nashib Ali Academy in Barpeta, Assam."
        />
      </Helmet>

      {/* Gallery Header */}
      <div className="gl-gallery-header">
        <h1 className="gl-gallery-title">School Gallery</h1>
       
      </div>

      {images.length > 0 && (
        <div className="text-[var(--text-main)] flex justify-center gap-2 mb-4">
          Showing{" "}
          <span className="font-semibold text-[var(--text-secondary)]">
            {visibleImages.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[var(--text-main)]">
            {images.length}
          </span>{" "}
          images
        </div>
      )}

      {/* Conditional Rendering: Loader vs Layout Grid */}
      {loading ? (
        <Loader />
      ) : (
        <div className="gl-gallery-grid">
          {images.length === 0 ? (
            <p className="gl-no-images">No images available at the moment.</p>
          ) : (
            visibleImages.map((item) => (
              <div
                key={item._id}
                className="gl-gallery-item"
              >
                <div className="gl-image-wrapper">
                  <img
                    src={item.url}
                    alt="Nashib Ali Academy gallery moment"
                    className="gl-gallery-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {visibleCount < images.length && (
        <div className="flex justify-center mt-8">
          <button className="flex justify-center items-center bg-amber-400 text-[var(--text-main)] outline-0 rounded-xl py-2 px-4 cursor-pointer hover:bg-amber-200 transition-all " onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
