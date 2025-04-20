import React from 'react';
import { Link } from 'react-router-dom';
import './StudentPortal.css';
import Header from '../../components/Header/Header';

const StudentPortal = () => {
  return (
    <>
      <Header title="Student Portal" tagline="Access all your student services in one place" />
      <div className="student-portal-container">
        <div className="student-portal-content">
          <h2>Student Portal</h2>
          
          <div className="service-grid">
            {/* Payment Options */}
            <div className="service-section">
              <div className="section-header">
                <h3>Payment Options</h3>
              </div>
              <ul className="service-list">
                <li className="service-item">
                  <Link to="/student-portal/fee-payment/monthly" className="service-link">
                    <i className="fas fa-money-bill-wave service-icon payment-icon"></i>
                    <span>Monthly Fee Payment</span>
                  </Link>
                </li>
                <li className="service-item">
                  <Link to="/student-portal/fee-payment/admission" className="service-link">
                    <i className="fas fa-user-graduate service-icon admission-icon"></i>
                    <span>Admission Fee Payment</span>
                  </Link>
                </li>
                <li className="service-item">
                  <Link to="/student-portal/fee-payment/hostel" className="service-link">
                    <i className="fas fa-bed service-icon hostel-icon"></i>
                    <span>Hostel Fee Payment</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Student Services */}
            <div className="service-section">
              <div className="section-header">
                <h3>Student Services</h3>
              </div>
              <ul className="service-list">
                <li className="service-item">
                  <Link to="/student-portal/student-services/result" className="service-link">
                    <i className="fas fa-chart-bar service-icon result-icon"></i>
                    <span>Result Check</span>
                  </Link>
                </li>
                <li className="service-item">
                  <Link to="/student-portal/student-services/admitCard" className="service-link">
                    <i className="fas fa-id-card service-icon admit-icon"></i>
                    <span>Admit Card Download</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;