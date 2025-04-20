import React, { useContext, useState } from "react";
import "./Academics.css";
import student1 from "/teacher1.jpg";
import student2 from "/teacher2.jpg";
import Header from "../../components/Header/Header";

const Academics = () => {

  return (
    <div className="academics-page">
      <div className="bubble-background">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <section className="academics-header">
        <Header title={"Academics 2025"} tagline={"Empowering Excellence in Education"} />
      </section>

      

      <section className="academics-section achievers-section">
        <h2 className="section-title">Our Top Achievers</h2>
        <div className="achievers-container">
          <div className="achiever-wrapper">
            <div className="achiever-card">
              <img src={student2} alt="Aliya Khan" className="achiever-photo" />
              <h3 className="card-name">Aliya Khan</h3>
              <p className="card-role">Student</p>
              <p className="card-achievement">Scored 98% in the 2024 Annual Exams</p>
            </div>
          </div>
          <div className="achiever-wrapper">
            <div className="achiever-card">
              <img src={student1} alt="Rahul Sharma" className="achiever-photo" />
              <h3 className="card-name">Rahul Sharma</h3>
              <p className="card-role">Student</p>
              <p className="card-achievement">1st Place in the National Math Olympiad 2024</p>
            </div>
          </div>
          <div className="achiever-wrapper">
            <div className="achiever-card">
              <img src={student1} alt="Rahul Sharma" className="achiever-photo" />
              <h3 className="card-name">Rahul Sharma</h3>
              <p className="card-role">Student</p>
              <p className="card-achievement">1st Place in the National Math Olympiad 2024</p>
            </div>
          </div>
          <div className="achiever-wrapper">
            <div className="achiever-card">
              <img src={student1} alt="Rahul Sharma" className="achiever-photo" />
              <h3 className="card-name">Rahul Sharma</h3>
              <p className="card-role">Student</p>
              <p className="card-achievement">1st Place in the National Math Olympiad 2024</p>
            </div>
          </div>
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
    </div>
  );
};

export default Academics;