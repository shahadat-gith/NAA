import React, { useRef } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";
import "./IdCardDownload.css";
import capitalizeWords from "../../../../Utils/utility";

import logo from "/logo.png";
import userImg from "/user.png";
import QR from "/naa_qr.png";

import { useLocation } from "react-router-dom";
import IdCardPdf from "./IdCardPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

const IdCardDownload = () => {
  const SCHOOL_DETAILS = {
    name: "NASHIB ALI ACADEMY",
    address: "Barpeta, Assam - 781127",
    contact: "+91-60014-16724",
    email: "nashibaliacademy.offl@gmail.com",
    website: "www.nashibaliacademy.edu.in",
  };

  const cardPairRef = useRef();
  const location = useLocation();
  const { student } = location?.state?.data || {};

  const handleBack = () => window.history.back();

  // Guard safety clause to prevent crashes if routed directly without state
  if (!student) {
    return (
      <div className="idc-dl-wrapper">
        <div className="idc-dl-topbar">
          <button className="idc-dl-btn-back" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className="idc-dl-error-msg">
          No student data found. Please go back and retry.
        </div>
      </div>
    );
  }

  const details = [
    { label: "Father's Name", value: capitalizeWords(student.fatherName) },
    { label: "Phone No", value: capitalizeWords(student.phone || "N/A") },
    { label: "Class", value: capitalizeWords(student.class) },
    { label: "Medium", value: capitalizeWords(student.medium) },
    ...(student.stream
      ? [{ label: "Stream", value: capitalizeWords(student.stream) }]
      : []),
    { label: "Student ID", value: student.registrationNo },
  ];

  return (
    <div className="idc-dl-wrapper">
      {/* TOPBAR CONTROLS MODULE */}
      <div className="idc-dl-topbar">
        <button className="idc-dl-btn-back" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>

        <PDFDownloadLink
          className="idc-dl-btn-download"
          document={
            <IdCardPdf
              student={student}
              logoUrl={logo}
              userPlaceholderUrl={userImg}
              qrCodeUrl={QR}
            />
          }
          fileName={`id_card_${student.registrationNo || "student"}.pdf`}
        >
          {({ loading }) => (
            <>
              <FaDownload style={{ marginRight: "8px" }} />
              {loading ? "Generating PDF..." : "Download PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* SCALE SHEET CONTAINER */}
      <div className="idc-dl-scale-wrapper">
        <div className="id-card-layout-container" ref={cardPairRef}>
          {/* FRONT (Design Preserved Entirely) */}
          <div className="id-card-wrapper">
            <div className="id-card id-card-front">
              <div className="id-card-header">
                <img src={logo} alt="Academy Logo" className="id-card-logo" />
                <div className="id-card-header-text">
                  <h1 className="id-card-title">{SCHOOL_DETAILS.name}</h1>
                  <div className="id-card-tagline">
                    <span>KNOWLEDGE</span> | <span>DISCIPLINE</span> |{" "}
                    <span>SUCCESS</span>
                  </div>
                </div>
              </div>

              <div className="id-card-body">
                <div className="id-card-body-left">
                  <div className="id-details-grid">
                    {details.map(({ label, value }) => (
                      <div className="id-detail-row" key={label}>
                        <span className="id-detail-label">{label}</span>
                        <span className="id-detail-colon">:</span>
                        <span className="id-detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="id-card-body-right">
                  <div className="id-photo-frame">
                    <img
                      src={student.image?.url || userImg}
                      alt={student.name}
                    />
                  </div>

                  <div className="id-name-banner">
                    <h2>{student.name}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="id-card-label">Front Page</div>
          </div>

          {/* BACK (Design Preserved Entirely) */}
          <div className="id-card-wrapper">
            <div className="id-card id-card-back">
              <div className="id-back-header-decoration">
                <img
                  src={logo}
                  alt="Academy Crest"
                  className="id-back-mini-logo"
                />
              </div>

              <div className="id-back-content-stack">
                <div className="id-back-section">
                  <div className="id-section-divider-row">
                    <div className="id-section-line" />
                    <div className="id-section-badge">
                      Terms &amp; Conditions
                    </div>
                    <div className="id-section-line" />
                  </div>
                  <ul className="id-tc-list">
                    {[
                      "This ID card is the property of Nashib Ali Academy.",
                      "This card is non-transferable and must be carried at all times.",
                      "The card must be produced on demand by any authorized person.",
                      "If lost or found, please inform the school office immediately.",
                    ].map((text, idx) => (
                      <li key={idx}>
                        <div className="id-bullet-point" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="id-back-section">
                  <div className="id-section-divider-row">
                    <div className="id-section-line" />
                    <div className="id-section-badge">Contact Us</div>
                    <div className="id-section-line" />
                  </div>

                  <div className="id-contact-container">
                    <div className="id-contact-info-block">
                      <div className="id-contact-item">
                        <FaPhoneAlt className="id-contact-icon" />{" "}
                        {SCHOOL_DETAILS.contact}
                      </div>
                      <div className="id-contact-item">
                        <FaEnvelope className="id-contact-icon" />{" "}
                        {SCHOOL_DETAILS.email}
                      </div>
                      <div className="id-contact-item">
                        <FaMapMarkerAlt className="id-contact-icon" />{" "}
                        {SCHOOL_DETAILS.address}
                      </div>
                      <div className="id-contact-item">
                        <FaGlobe className="id-contact-icon" />{" "}
                        {SCHOOL_DETAILS.website}
                      </div>
                    </div>

                    <div className="id-back-qr-code">
                      <img src={QR} alt="QR Code" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="id-back-footer">
                <span className="id-footer-note">
                  Thank you for being a part of
                </span>
                <span className="id-footer-institution">
                  {SCHOOL_DETAILS.name}
                </span>
              </div>
            </div>

            <div className="id-card-label">Back Page</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardDownload;