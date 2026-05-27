import React, { useContext, useEffect, useState } from "react";
import "./Academics.css";
import Header from "../../components/Header/Header";
import { AppContext } from '../../context/AppContext';
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Loader from "../../components/Loader/Loader";

const Academics = () => {
  const { backendUrl } = useContext(AppContext);
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/achievers/get-achievers`);
      if (response.data.success) {
        setAchievers(response.data.achievers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      fetchAchievers();
    }
  }, [backendUrl]);

  const openImagePopup = (imageUrl) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="acd-academics-page loader-parent">
      <Helmet>
        <title>Academics | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore academic programs, curriculum and learning environment at Nashib Ali Academy."
        />
      </Helmet>

      <section className="acd-header-section">
        <Header
          title={`Academics ${new Date().getFullYear()}`}
          tagline={"Empowering Excellence in Education"}
        />
      </section>

      <section className="acd-section acd-achievers-section">
        <h2 className="acd-section-title">Our Top Achievers</h2>
        <div className="acd-achievers-container">
          {loading ? (
            <Loader text="Loading achievers data..." overlay={false} />
          ) : achievers?.length > 0 ? (
            <div className="acd-table-wrapper">
              <table className="acd-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Achievement</th>
                    <th>Father</th>
                    <th>Mother</th>
                    <th>Village</th>
                  </tr>
                </thead>
                <tbody>
                  {achievers.map((achiever, index) => (
                    <tr 
                      key={index} 
                      className="acd-row" 
                      onClick={() => openImagePopup(achiever.image)}
                    >
                      <td className="acd-image-cell">
                        <img
                          src={achiever.image || "/user.jpg"}
                          alt={achiever.name || "Achiever"}
                          className="acd-achiever-img"
                        />
                      </td>
                      <td className="acd-name-cell">{achiever.name}</td>
                      <td className="acd-achievement-cell">
                        {`Scored ${achiever.percentage}% in class ${achiever.className} in ${achiever.year}`}
                      </td>
                      <td>{achiever.father || 'N/A'}</td>
                      <td>{achiever.mother || 'N/A'}</td>
                      <td>{achiever.village || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="acd-no-data-msg">No achievers available.</p>
          )}
        </div>
      </section>

      <section className="acd-section acd-resources-section">
        <h2 className="acd-section-title">Online Learning Resources</h2>
        <div className="acd-resources-container">
          <div className="acd-resource-card acd-ebooks-card">
            <h3 className="acd-card-title">E-Books</h3>
            <p className="acd-card-description">Access a rich collection of e-books for all subjects.</p>
            <a href="https://site.sebaonline.org/textbook" target="_blank" rel="noopener noreferrer" className="acd-premium-btn">
              Explore E-Books
            </a>
          </div>

          <div className="acd-resource-card acd-materials-card">
            <h3 className="acd-card-title">Study Materials</h3>
            <p className="acd-card-description">Download past year questions (PYQs), notes, and more.</p>
            <div className="acd-materials-btn-group">
              <a href="/pyqs" className="acd-premium-btn">PYQs</a>
              <a href="/notes" className="acd-premium-btn">Notes</a>
            </div>
          </div>

          <div className="acd-resource-card acd-lectures-card">
            <h3 className="acd-card-title">Online Lectures</h3>
            <p className="acd-card-description">Watch recorded lectures for in-depth learning.</p>
            <a href="https://www.sebaonline.info/studentcorner/main.php" className="acd-premium-btn" target="_blank" rel="noopener noreferrer">
              Access Lectures
            </a>
          </div>
        </div>
      </section>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="acd-modal-overlay" onClick={closeImagePopup}>
          <div className="acd-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="acd-modal-close-btn" onClick={closeImagePopup} title="Close">
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage} alt="Enlarged Achiever Visual" className="acd-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;