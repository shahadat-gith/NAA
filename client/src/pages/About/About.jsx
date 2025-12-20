import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Header from '../../components/Header/Header';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const faqs = [
    {
      id: "faq1",
      question: "What is the admission process?",
      answer:
        "The admission process includes submitting an application form, attending an interview, and passing an entrance exam. Contact our office for more details.",
    },
    {
      id: "faq2",
      question: "What ages does the academy serve?",
      answer:
        "We serve students from ages 5 to 18, offering programs from kindergarten through high school.",
    },
    {
      id: "faq3",
      question: "Are there extracurricular activities?",
      answer:
        "Yes, we offer a wide range of activities including sports, music, drama, and robotics clubs.",
    },
    {
      id: "faq4",
      question: "What are the school timings?",
      answer:
        "Our school operates from 8:00 AM to 3:00 PM, Monday to Friday. Extracurricular activities and special programs may have different schedules.",
    },
    {
      id: "faq5",
      question: "Does the academy provide transportation?",
      answer:
        "Yes, we have a fleet of school buses covering various routes. Contact the administration for details about routes and fees.",
    },
    {
      id: "faq6",
      question: "What is the fee structure?",
      answer:
        "Our fee structure varies by grade level. Please visit our office or website for detailed information on tuition and additional charges.",
    },
    {
      id: "faq7",
      question: "Are meals provided at the academy?",
      answer:
        "Yes, we offer a nutritious meal program at our cafeteria. Students can bring their own lunch or opt for the school meal plan.",
    },
    {
      id: "faq8",
      question: "What curriculum does the academy follow?",
      answer:
        "We follow a comprehensive curriculum aligned with national education standards, incorporating both academic and skill-based learning.",
    },
    {
      id: "faq9",
      question: "Is there a uniform requirement?",
      answer:
        "Yes, all students are required to wear the school uniform. Details on uniform specifications and purchase options are available at the administration office.",
    },
    {
      id: "faq10",
      question: "How can parents stay updated about school events?",
      answer:
        "We regularly update parents via email, SMS notifications, and our official website. Parents can also attend PTA meetings for further engagement.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFAQ = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Learn about Nashib Ali Academy, our vision, mission, values and commitment to quality education."
        />
      </Helmet>

      <Header
        title="About Nashib Ali Academy"
        tagline="A Legacy of Excellence in Education"
      />

      {/* Our Mission */}
      <section className="about-section mission-section">
        <div className="section-container">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-content">
            At Nashib Ali Academy, our mission is to empower students with a world-class education that nurtures their intellectual, emotional, and social growth. We strive to create a dynamic learning environment that fosters creativity, critical thinking, and a passion for lifelong learning.
          </p>
        </div>
      </section>

      {/* Our History */}
      <section className="about-section history-section">
        <div className="section-container">
          <h2 className="section-title">Our History</h2>
          <p className="section-content">
            Founded in 2015 by visionary men Abdul Mozid Mondal(Principal) and Sultan Mahmud(Managing Director), our academy has grown into a prestigious institution known for academic excellence and holistic development. Over the years, we have shaped thousands of students into confident, compassionate, and capable individuals, contributing to society with integrity and purpose.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-section values-section">
        <div className="section-container">
          <h2 className="section-title">Our Values</h2>
          <p className="section-content">
            Our core values guide everything we do, shaping our students into well-rounded individuals ready to face the world.
          </p>
          <div className="values-list">
            <span className="value-item">Integrity</span>
            <span className="value-item">Excellence</span>
            <span className="value-item">Community</span>
            <span className="value-item">Innovation</span>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="about-section programs-section">
        <div className="section-container">
          <h2 className="section-title">Our Programs</h2>
          <p className="section-content">
            We offer a diverse range of educational programs tailored to meet the needs of students from Nursery to Higher Secondary.
          </p>
          <div className="programs-list">
            <div className="program-item">
              <div className="program-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="program-title">English Medium Education</h3>
              <p className="program-description">
                From Nursery to Class 10, our English medium curriculum emphasizes proficiency in English, Mathematics, General Science, and more through interactive learning.
              </p>
            </div>
            <div className="program-item">
              <div className="program-icon">
                <i className="fas fa-language"></i>
              </div>
              <h3 className="program-title">Assamese Medium Education</h3>
              <p className="program-description">
                From Ankur to Class 10, we provide a culturally rich education focusing on Assamese language and literature alongside core subjects like Mathematics and Social Studies.
              </p>
            </div>
            <div className="program-item">
              <div className="program-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="program-title">Higher Secondary Streams</h3>
              <p className="program-description">
                Specialized Arts and Science streams for Classes 11–12, offering subjects like Physics, Chemistry, Biology, Political Science, and Advance Assamese.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Facilities */}
      <section className="about-section facilities-section">
        <div className="section-container">
          <h2 className="section-title">Our Facilities</h2>
          <p className="section-content">
            Our state-of-the-art facilities create an environment conducive to learning, creativity, and personal growth.
          </p>
          <div className="facilities-list">
            <div className="facility-item">
              <div className="facility-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3 className="facility-title">Separate Hostels</h3>
              <p className="facility-description">
                Safe and comfortable residential facilities with separate hostels for girls and boys, fostering a supportive community.
              </p>
            </div>
            <div className="facility-item">
              <div className="facility-icon">
                <i className="fas fa-flask"></i>
              </div>
              <h3 className="facility-title">Modern Laboratories</h3>
              <p className="facility-description">
                Well-equipped labs for Chemistry, enabling hands-on learning and experimentation.
              </p>
            </div>
            <div className="facility-item">
              <div className="facility-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="facility-title">Mini Library</h3>
              <p className="facility-description">
                A vast collection of textbooks are available in our mini library
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <h3 className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                  {faq.question}
                  <span className={`faq-toggle-icon ${openFaq === faq.id ? 'open' : ''}`}>
                    <i className={openFaq === faq.id ? 'fas fa-minus' : 'fas fa-plus'}></i>
                  </span>
                </h3>
                <div className={`faq-answer ${openFaq === faq.id ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;