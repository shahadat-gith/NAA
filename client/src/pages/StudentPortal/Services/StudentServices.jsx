import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import TabNavigation from "./TabNavigation";
import ResultCheckTab from "./ResultCheckTab";
import AdmitCardTab from "./AdmitCardTab";
import { fetchSettings } from "./api";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader"; // Import Loader
import "./StudentServices.css";

const StudentServices = ({ defaultTab }) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState(tab || defaultTab || "result");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Result Check State
  const [registrationNo, setRegistrationNo] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [resultData, setResultData] = useState(null);

  // Admit Card State
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [admitCardConfig, setAdmitCardConfig] = useState(null);

  useEffect(() => {
    navigate(`/student-portal/student-services/${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  useEffect(() => {
    if (activeTab === "admitCard") {
      const loadSettings = async () => {
        try {
          setLoading(true);
          const data = await fetchSettings(backendUrl);
          setAdmitCardConfig(data.admitCardConfig);
        } catch (err) {
          toast.error("Error fetching settings");
        } finally {
          setLoading(false);
        }
      };
      loadSettings();
    }
  }, [backendUrl, activeTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
    setLoading(false);
    if (tab === "result") {
      setStudents([]);
      setSelectedStudent(null);
      setSearchTerm("");
    } else {
      setResultData(null);
      setRegistrationNo("");
      setExamName("");
      setAcademicSession("");
    }
  };

  return (
    <div className="student-services-container">
      <TabNavigation activeTab={activeTab} switchTab={switchTab} navigate={navigate} />
      {loading && <Loader message="Loading settings..." />}
      <div className="tab-content">
        {activeTab === "result" ? (
          <ResultCheckTab
            registrationNo={registrationNo}
            setRegistrationNo={setRegistrationNo}
            examName={examName}
            setExamName={setExamName}
            academicSession={academicSession}
            setAcademicSession={setAcademicSession}
            resultData={resultData}
            setResultData={setResultData}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            backendUrl={backendUrl}
          />
        ) : (
          <AdmitCardTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            students={students}
            setStudents={setStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            admitCardConfig={admitCardConfig}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            backendUrl={backendUrl}
          />
        )}
      </div>
    </div>
  );
};

export default StudentServices;