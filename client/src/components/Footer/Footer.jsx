import React, { useContext, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Footer = () => {
  const {backendUrl} = useContext(AppContext)
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
   
  };

  return (
    <footer className="footer-premium">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Nashib Ali Academy</h3>
          <p className="footer-text">
            Empowering education with excellence and innovation since 2015.
            Dedicated to shaping future leaders.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><a href="https://site.sebaonline.org/" className="footer-link" target="_blank" rel="noopener noreferrer">SEBA Website</a></li>
            <li><a href="https://site.sebaonline.org/downloads/" className="footer-link" target="_blank" rel="noopener noreferrer">Download SQP</a></li>
            <li><a href="https://site.sebaonline.org/results/" className="footer-link" target="_blank" rel="noopener noreferrer">SEBA Result Page</a></li>
            <li><a href="https://www.sebaonline.info/studentcorner/main.php" className="footer-link" target="_blank" rel="noopener noreferrer">Resources Lists</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Education Lane, Knowledge City, 12345</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@nashibaliacademy.edu</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Newsletter</h4>
          <p className="footer-text">Stay updated with our latest news and events.</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" className="newsletter-btn" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Nashib Ali Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;