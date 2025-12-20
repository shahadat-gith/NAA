import React, { useContext, useEffect, useState } from "react";
import "./Academics.css";
import Header from "../../components/Header/Header";
import { AppContext } from '../../context/AppContext';
import axios from "axios";
import user from '/user.jpg'
import { Helmet } from "react-helmet-async";

const Academics = () => {
  const { backendUrl } = useContext(AppContext);
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchAchievers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/achievers/get-achievers`);
      if (response.data.success) {
        setAchievers(response.data.achievers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchAchievers();
  }, [backendUrl]);

  const openImagePopup = (imageUrl) => {
    if (!imageUrl) {
      return
    }

    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="academics-page">
      <Helmet>
        <title>Academics | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore academic programs, curriculum and learning environment at Nashib Ali Academy."
        />
      </Helmet>

      <section className="academics-header">
        <Header title={"Academics 2025"} tagline={"Empowering Excellence in Education"} />
      </section>
      <section className="academics-section achievers-section">
        <h2 className="section-title">Our Top Achievers</h2>
        <div className="achievers-container">
          {loading ? (
            <p className="no-achievers">Loading data...</p>
          ) : achievers?.length > 0 ? (
            <div className="achievers-table-wrapper">
              <table className="achievers-table">
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
                    <tr key={index} className="achiever-row" onClick={() => openImagePopup(achiever.image)}>
                      <td className="image-cell">
                        {achiever.image ? (
                          <img
                            src={achiever.image}
                            alt={achiever.name}
                            className="achiever-image"
                          />
                        ) : (
                          <img
                            src={user}
                            className="achiever-image"
                          />
                        )}
                      </td>
                      <td>{achiever.name}</td>
                      <td>{`Scored ${achiever.percentage}% in class ${achiever.className} in ${achiever.year}`}</td>
                      <td>{achiever.father || 'N/A'}</td>
                      <td>{achiever.mother || 'N/A'}</td>
                      <td>{achiever.village || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-achievers">No achievers available.</p>
          )}
        </div>
      </section>


      <section className="resources-section">
        <h2 className="section-title">Online Learning Resources</h2>
        <div className="resources-container">
          <div className="resource-subsection ebooks">
            <h3 className="subsection-title">E-Books</h3>
            <p className="subsection-description">Access a rich collection of e-books for all subjects.</p>
            <a href="https://site.sebaonline.org/textbook" target="_blank" className="premium-link-btn">
              Explore E-Books
            </a>
          </div>
          <div className="resource-subsection study-materials">
            <h3 className="subsection-title">Study Materials</h3>
            <p className="subsection-description">Download past year questions (PYQs), notes, and more.</p>
            <div className="study-materials-links">
              <a href="/pyqs" className="premium-link-btn">PYQs</a>
              <a href="/notes" className="premium-link-btn">Notes</a>
            </div>
          </div>
          <div className="resource-subsection lectures">
            <h3 className="subsection-title">Online Lectures</h3>
            <p className="subsection-description">Watch recorded lectures for in-depth learning.</p>
            <a href="https://www.sebaonline.info/studentcorner/main.php" className="premium-link-btn" target="_blank">
              Access Lectures
            </a>
          </div>
        </div>
      </section>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="image-popup-modal" onClick={closeImagePopup}>
          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-popup-close" onClick={closeImagePopup} title="Close">
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage} alt="Large Achiever Image" className="image-popup-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;