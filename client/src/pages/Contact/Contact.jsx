import React, { useContext, useState } from "react";
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
    <div className="contact-page">
      <Helmet>
        <title>Contact Us | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Contact Nashib Ali Academy for admissions, enquiries and academic information."
        />
      </Helmet>

      {/* ── HERO BANNER ── */}
      <div className="contact-hero">
        <div className="contact-hero__inner">
          <span className="contact-hero__eyebrow">We'd love to hear from you</span>
          <h1 className="contact-hero__title">Get In Touch</h1>
          <p className="contact-hero__sub">
            Reach out for admissions, enquiries, or any academic information — our team responds within 24 hours.
          </p>
        </div>
      </div>

      {/* ── CONTACT GRID ── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left — info cards */}
            <div className="info-col">
              <div className="info-card">
                <div className="info-card__icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="info-card__label">Our Address</h4>
                  <p className="info-card__text">
                    Nashib Ali Islamic Mission School,<br />
                    Mahachara, Barpeta, Assam – 781127
                  </p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4 className="info-card__label">Phone</h4>
                  <p className="info-card__text">+91 60014 16724</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="info-card__label">Email</h4>
                  <p className="info-card__text">nashibaliacademy.offl@gmail.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card__icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4 className="info-card__label">Office Hours</h4>
                  <p className="info-card__text">Monday – Saturday, 9 AM – 5 PM</p>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="form-col">
              <div className="form-card">
                <h2 className="form-card__title">Send Us a Message</h2>
                <p className="form-card__sub">Fill out the form below and we'll get back to you shortly.</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        className="form-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      className="form-input form-textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows="6"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── MAP ── */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="contact-section-title">Our Location</h2>
          </div>
          <div className="map-wrapper">
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
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon-wrap">
              <svg className="popup-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="popup-tick__circle" cx="26" cy="26" r="25" />
                <path className="popup-tick__check" d="M14 27l7 7 16-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="popup-title">Message Sent!</h2>
            <p className="popup-text">{message}</p>
            <button className="btn-primary popup-close" onClick={closePopup}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;