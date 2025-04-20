import React, { useState } from 'react';
import './About.css';
import Header from '../../components/Header/Header';

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
     <Header
        title={"About Nashib Ali Academy"}
        tagline={"A Legacy of Excellency in Education"}

     />

      {/* Our Mission */}
      <section className="about-section mission-section">
        <div className="section-container">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-content">
            At Nashib Ali Academy, our mission is to empower students with a world-class education that nurtures their intellectual, emotional, and social growth.
          </p>
        </div>
      </section>

      {/* Our History */}
      <section className="about-section history-section">
        <div className="section-container">
          <h2 className="section-title">Our History</h2>
          <p className="section-content">
            Founded in 1995 by visionary educator Nashib Ali, our academy has grown into a prestigious school known for academic excellence.
          </p>
        </div>
      </section>


{/*FAQ SECTION*/}
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
