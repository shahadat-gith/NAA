import React, { useContext, useState } from "react";
import "./Admission.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import axios from "axios"
import { AppContext } from "../../context/AppContext";
import Header from "../../components/Header/Header";

const Admission = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/query/submit-admission-query`, formData);


      if (response.data.success) {
        setShowPopup(true);
        setMessage(response.data.message)
      } else {
        console.log("Condition not met, success might be undefined or false.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
    }
  };





  const closePopup = () => {
    setShowPopup(false);
    setFormData({ name: "", email: "", message: "" }); // Reset form
    navigate('/')
  };

  return (
    <div className="admission-page">
      {/* Header Section */}
      <section className="admission-header">
        <Header
          title={"Admission 2025"}
          tagline={" Unlock Your Future at Nashib Ali Academy"}
          headerButton= "Apply now"
        />
      </section>

      {/* Application Process */}
      <section className="admission-section process-section">
        <h2 className="section-title">Application Process</h2>
        <ol className="process-list">
          <li>
            <span className="step-number">1</span>
            <p className="step-description">
              Complete the online application form available on our website.
            </p>
          </li>
          <li>
            <span className="step-number">2</span>
            <p className="step-description">
              after completing admission, wait for confirmation message, once your admission is verified we will send you confirmation mail
            </p>
          </li>
          <li>
            <span className="step-number">3</span>
            <p className="step-description">
             when you get confirmation mail login to our website using your email and password "123456"
            </p>
          </li>
          <li>
            <span className="step-number">4</span>
            <p className="step-description">
              Go to your profile and download admission and fee payment receipt.
            </p>
          </li>
          <li>
            <span className="step-number">5</span>
            <p className="step-description">
              Appear for the interview (if applicable)
            </p>
          </li>
        </ol>

      </section>

      {/* Important Dates */}
      <section className="admission-section dates-section">
        <h2 className="section-title">Important Dates</h2>
        <div className="dates-table-container">
          <table className="dates-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Application Start</td>
                <td>1st March 2025</td>
              </tr>
              <tr>
                <td>Application Deadline</td>
                <td>15th April 2025</td>
              </tr>
              <tr>
                <td>Entrance Exam</td>
                <td>20th April 2025</td>
              </tr>
              <tr>
                <td>Result Announcement</td>
                <td>5th May 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact for Admission */}
      <section className="admission-section contact-section">
        <h2 className="section-title">Contact for Admission</h2>
        <p className="section-description">
          Have questions? Reach out to our admission office for personalized
          assistance.
        </p>
        <form className="admission-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Query</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your inquiry..."
            ></textarea>
          </div>
          <button type="submit" className="premium-button">
            Send Inquiry
          </button>
        </form>
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

export default Admission;