import { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState("Loading...");

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/shahadat-gith/NAA/commits?per_page=1",
        );

        if (!response.ok) {
          throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();

        const commitDate = data[0]?.commit?.committer?.date;

        if (!commitDate) {
          throw new Error("Commit date not found");
        }

        const formattedDate = new Date(commitDate).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        setLastUpdated(formattedDate);
      } catch (error) {
        console.error("Error fetching from GitHub:", error);
        setLastUpdated("Recently");
      }
    };

    fetchLastUpdate();
  }, []);

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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <a
                href="https://site.sebaonline.org/"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                SEBA Website
              </a>
            </li>
            <li>
              <a
                href="https://site.sebaonline.org/downloads/"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download SQP
              </a>
            </li>
            <li>
              <a
                href="https://site.sebaonline.org/results/"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                SEBA Result Page
              </a>
            </li>
            <li>
              <a
                href="https://www.sebaonline.info/studentcorner/main.php"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resources Lists
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">School & Policies</h4>
          <ul className="footer-links">
            <li>
              <Link to="/legal/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/terms" className="footer-link">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/legal/refund" className="footer-link">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/data-policy" className="footer-link">
                Data Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/cookies" className="footer-link">
                Cookies Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Shimulbari Mahachara Chariali, Barpeta, Assam</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+91 6001-416724</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>nashibaliacademy.offl@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-teacher-portal">
        <div className="footer-teacher-onboarding">
          <Link to="/staff/onboard" className="onboard-link">
            Staff Registration
          </Link>
        </div>
        <div className="footer-staff-portal">
          <a
            href="https://staff.nashibaliacademy.in"
            target="_blank"
            rel="noopener noreferrer"
            className="teacher-portal-link"
          >
            Staff Portal
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Nashib Ali Academy.</p>
        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          Last Updated: {lastUpdated}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
