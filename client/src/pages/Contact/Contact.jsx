import React, { useContext, useState } from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Header from "../../components/Header/Header";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("")
  const { backendUrl } = useContext(AppContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
    navigate('/')

  };

  return (
    <div className="contact-page">

      <Helmet>
        <title>Contact Us | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Contact Nashib Ali Academy for admissions, enquiries and academic information."
        />
      </Helmet>

      {/* Header Section */}
      <section className="contact-header">
        <Header
          title={"Get in Touch"}
          tagline={" We’d love to hear from you! Reach out with any questions or inquiries."}
        />
      </section>

      {/* Contact Form Section (Display Only) */}
      <section className="contact-section form-section">
        <div className="section-container">
          <h2 className="section-title">Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
              />
            </div>
            <button type="submit" className="form-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="contact-section details-section">
        <div className="section-container">
          <h2 className="section-title">Contact Details</h2>
          <div className="contact-details">
            <div className="contact-detail-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>
                Nashib Ali Islamic Mission School, Mahachara,,Barpeta, Assam,
                781127
              </p>
            </div>
            <div className="contact-detail-item">
              <i className="fas fa-phone-alt"></i>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-detail-item">
              <i className="fas fa-envelope"></i>
              <p>contact@nashibaliacademy.org</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-section map-section">
        <div className="map-container">
          <iframe
            title="Nashib Ali Islamic Mission School Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.9305242491383!2d91.0561902!3d26.142878999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37598f17d1fb71e9%3A0xcff5bf6241ecabcd!2sNashib%20Ali%20Islamic%20Mission%20School!5e0!3m2!1sen!2sin!4v1698765432"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Pop-up Confirmation Message */}
      {showPopup && (
        <div className="confirmation-popup-overlay">
          <div className="confirmation-popup">
            <div className="tick-container">
              <svg
                className="tick-sign"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle className="tick-circle" cx="26" cy="26" r="25" />
                <path
                  className="tick-check"
                  d="M14 27l7 7 16-16"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="5"
                />
              </svg>
            </div>
            <h2 className="confirmation-title">Thank You!</h2>
            <p className="confirmation-text">
              {message}
            </p>
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;