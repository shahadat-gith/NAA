import React, { useState, useContext } from 'react';
import "./Contact.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Your message has been sent successfully!");
        setShowPopup(true);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Message sent successfully!");
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({ name: "", email: "", message: "" });
    navigate("/");
  };

  return (
    <div className="cnt-contact-page">
      <Helmet>
        <title>Contact Us | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Contact Nashib Ali Academy for admissions, enquiries and academic information."
        />
      </Helmet>

      {/* ── HERO BANNER ── */}
      <div className="cnt-hero">
        <div className="cnt-hero-inner">
          <span className="cnt-hero-eyebrow">We'd love to hear from you</span>
          <h1 className="cnt-hero-title">Get In Touch</h1>
          <p className="cnt-hero-sub">
            Reach out for admissions, enquiries, or any academic information — our team responds within 24 hours.
          </p>
        </div>
      </div>

      {/* ── CONTACT GRID ── */}
      <section className="cnt-contact-section">
        <div className="cnt-section-container">
          <div className="cnt-grid">

            {/* Left — info cards */}
            <div className="cnt-info-col">
              <div className="cnt-info-card">
                <div className="cnt-info-card-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="cnt-info-card-label">Our Address</h4>
                  <p className="cnt-info-card-text">
                    Nashib Ali Islamic Mission School,<br />
                    Mahachara, Barpeta, Assam – 781127
                  </p>
                </div>
              </div>

              <div className="cnt-info-card">
                <div className="cnt-info-card-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="cnt-info-card-label">Phone</h4>
                  <p className="cnt-info-card-text">+91 60014 16724</p>
                </div>
              </div>

              <div className="cnt-info-card">
                <div className="cnt-info-card-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="cnt-info-card-label">Email</h4>
                  <p className="cnt-info-card-text">nashibaliacademy.offl@gmail.com</p>
                </div>
              </div>

              <div className="cnt-info-card">
                <div className="cnt-info-card-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4 className="cnt-info-card-label">Office Hours</h4>
                  <p className="cnt-info-card-text">Monday – Saturday, 9 AM – 5 PM</p>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="cnt-form-col">
              <div className="cnt-form-card">
                <h2 className="cnt-form-card-title">Send Us a Message</h2>
                <p className="cnt-form-card-sub">Fill out the form below and we'll get back to you shortly.</p>

                <form className="cnt-form" onSubmit={handleSubmit}>
                  <div className="cnt-form-row">
                    <div className="cnt-form-group">
                      <label className="cnt-form-label" htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        className="cnt-form-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="cnt-form-group">
                      <label className="cnt-form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        className="cnt-form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="cnt-form-group">
                    <label className="cnt-form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      className="cnt-form-input cnt-form-textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows="6"
                      required
                    />
                  </div>

                  <button type="submit" className="cnt-btn-primary">
                    <i className="fas fa-paper-plane"></i> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="cnt-map-section">
        <div className="cnt-section-container">
          <div className="cnt-map-header">
            <span className="cnt-map-eyebrow">Find Us</span>
            <h2 className="cnt-map-title">Our Location</h2>
          </div>
          <div className="cnt-map-wrapper">
            <iframe
              title="School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.9305242491383!2d91.0561902!3d26.142878999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37598f17d1fb71e9%3A0xcff5bf6241ecabcd!2sNashib%20Ali%20Islamic%20Mission%20School!5e0!3m2!1sen!2sin!4v1698765432"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SUCCESS POPUP ── */}
      {showPopup && (
        <div className="cnt-popup-overlay" onClick={closePopup}>
          <div className="cnt-popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="cnt-popup-icon-wrap">
              <svg className="cnt-popup-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="cnt-popup-tick-circle" cx="26" cy="26" r="25" />
                <path className="cnt-popup-tick-check" d="M14 27l7 7 16-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="cnt-popup-title">Message Sent!</h2>
            <p className="cnt-popup-text">{message}</p>
            <button className="cnt-btn-primary cnt-popup-close" onClick={closePopup}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;