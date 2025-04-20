import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import TabNavigation from "./TabNavigation";
import PaymentTab from "./PaymentTab";
import "./FeePayment.css";

const FeePayment = ({ defaultTab = "monthly" }) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState(tab || defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    navigate(`/student-portal/fee-payment/${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setStudents([]);
    setSelectedStudent(null);
    setPaymentAmount("");
    setError("");
    setCurrentPage(1);
  };

  return (
    <div className="fee-payment-container">
      <TabNavigation activeTab={activeTab} switchTab={switchTab} navigate={navigate} />
      <div className="tab-content">
        <PaymentTab
          activeTab={activeTab}
          backendUrl={backendUrl}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          students={students}
          setStudents={setStudents}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FeePayment;