import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProfileCard.css";
import { UserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";
import StudentProfileSidebar from "./StudentProfileSidebar";
import StudentProfileContent from "./StudentProfileContent";
import PaymentModal from "./PaymentModal";
import { fetchTransactions } from "./PaymentHandler";

const StudentProfileCard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: "", message: "", paymentId: "" });
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { studentData: student, studentToken, clearUserData } = useContext(UserContext);

  useEffect(() => {
    if (activeTab === "payment" && student && studentToken) {
      fetchTransactions(student._id, studentToken, backendUrl, setTransactions);
    }
  }, [activeTab, student, studentToken, backendUrl]);

  const closeModal = () => {
    setModal({ isOpen: false, type: "", message: "", paymentId: "" });
  };

  if (!student) {
    return <div className="student-profile-container">Loading student data...</div>;
  }

  return (
    <div className="student-profile-container">
      <div className="student-profile-card">
        <StudentProfileSidebar
          student={student}
          backendUrl={backendUrl}
          navigate={navigate}
          clearUserData={clearUserData}
        />
        <StudentProfileContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          student={student}
          transactions={transactions}
          showFullDetails={showFullDetails}
          setShowFullDetails={setShowFullDetails}
          backendUrl={backendUrl}
          studentToken={studentToken}
          setModal={setModal}
          navigate={navigate}
          fetchTransactions={() => fetchTransactions(student._id, studentToken, backendUrl, setTransactions)}
        />
      </div>
      {modal.isOpen && (
        <PaymentModal modal={modal} closeModal={closeModal} />
      )}
    </div>
  );
};

export default StudentProfileCard;