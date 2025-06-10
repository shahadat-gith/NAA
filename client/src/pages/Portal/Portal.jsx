import React, { useContext } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './Portal.css';
import { AppContext } from '../../context/AppContext';

const Portal = () => {
  const { adminToken } = useContext(AppContext);

  return (
    <div>
      <Header title="Student Portal" tagline="Access all your student services in one place" />
      <div className="portal-container">
        <div className="portal-title">
          <h2>Student Portal</h2>
        </div>
        <div className="portal-content">
          {adminToken && (
            <div className="portal-section">
              <div className="portal-section-title">
                <h3>Admin Options</h3>
              </div>
              <div className="portal-section-options">
                <ul className="portal-options-list">
                  {/* Admin options can be added here if needed */}
                </ul>
              </div>
            </div>
          )}
          <div className="portal-left">
            <div className="portal-left-title">
              <h3>Payment Options</h3>
            </div>
            <div className="portal-left-options">
              <ul className="portal-options-list">
                <li className="portal-options-list-item">
                  <Link to="/portal/fee/monthly" className="portal-options-list-item-link">
                    <i className="fas fa-money-bill-wave portal-icon payment-icon"></i>
                    <span>Monthly Fee Payment</span>
                  </Link>
                </li>
                <li className="portal-options-list-item">
                  <Link to="/portal/fee/admission" className="portal-options-list-item-link">
                    <i className="fas fa-user-graduate portal-icon admission-icon"></i>
                    <span>Admission Fee Payment</span>
                  </Link>
                </li>
                <li className="portal-options-list-item">
                  <Link to="/portal/fee/hostel" className="portal-options-list-item-link">
                    <i className="fas fa-bed portal-icon hostel-icon"></i>
                    <span>Hostel Fee Payment</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="portal-right">
            <div className="portal-right-title">
              <h3>Services</h3>
            </div>
            <div className="portal-right-options">
              <ul className="portal-right-options-list">
                <li className="portal-options-list-item">
                  <Link to="/portal/services/result" className="portal-options-list-item-link">
                    <i className="fas fa-chart-bar portal-icon result-icon"></i>
                    <span>Result Check</span>
                  </Link>
                </li>
                <li className="portal-options-list-item">
                  <Link to="/portal/services/admit-card" className="portal-options-list-item-link">
                    <i className="fas fa-id-card portal-icon admit-icon"></i>
                    <span>Admit Card</span>
                  </Link>
                </li>
                <li className="portal-options-list-item">
                  <Link to="/portal/services/id-card" className="portal-options-list-item-link">
                    <i className="fa-solid fa-id-card-clip portal-icon id-icon"></i>
                    <span>ID Card</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;