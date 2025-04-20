import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader/Loader";
import Sidebar from "./Components/Sidebar";
import ProfileTab from "./Components/ProfileTab";
import SalaryTab from "./Components/SalaryTab";
import BankTab from "./Components/BankTab";
import AttendanceTab from "./Components/AttendanceTab";
import { fetchSalaryTransactions, fetchAttendanceHistory, handleMarkAttendance, handleAcknowledgeSalary, handleBankDetailsUpdate } from "./api";
import "./TeacherProfile.css";

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [salaryTransactions, setSalaryTransactions] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { teacherData: teacher, teacherToken, clearUserData, setTeacherData } = useContext(UserContext);

  const [bankDetails, setBankDetails] = useState({
    bankName: teacher?.bankName || "",
    accountNumber: teacher?.accountNumber || "",
    ifscCode: teacher?.ifscCode || "",
    accountHolderName: teacher?.accountHolderName || "",
  });
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);

  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const attendancePerPage = 10;

  useEffect(() => {
    if (!teacherToken) {
      navigate("/login/teacher");
    }
    if (activeTab === "salary" && teacher && teacherToken) {
      fetchSalaryTransactions(backendUrl, teacherToken, teacher?._id, setIsLoading, setError, setSalaryTransactions, clearUserData, navigate);
    } else if (activeTab === "attendance" && teacher && teacherToken) {
      fetchAttendanceHistory(backendUrl, teacherToken, setIsLoading, setError, setAttendanceHistory, clearUserData, navigate);
    }
    setBankDetails({
      bankName: teacher?.bankName || "",
      accountNumber: teacher?.accountNumber || "",
      ifscCode: teacher?.ifscCode || "",
      accountHolderName: teacher?.accountHolderName || "",
    });
  }, [activeTab, teacher, teacherToken, navigate, backendUrl, clearUserData]);

  useEffect(() => {
    if (attendanceHistory.length > 0) {
      filterAttendanceByMonth();
    }
  }, [attendanceHistory, selectedMonth, selectedYear]);

  const filterAttendanceByMonth = () => {
    const filtered = attendanceHistory.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });
    
    setFilteredAttendance(filtered);
    calculateAttendanceStats(filtered);
    setCurrentPage(1);
  };

  const calculateAttendanceStats = (records) => {
    const present = records.filter(record => record.status === "Present").length;
    const absent = records.filter(record => record.status === "Absent").length;
    const late = records.filter(record => record.status === "Late").length;
    const total = records.length;
    
    setAttendanceStats({
      totalDays: total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePasswordChangeNavigation = () => {
    navigate("/forgot-password/teacher");
  };

  const handleLogout = () => {
    clearUserData("teacher");
    navigate("/login/teacher");
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  if (!teacherToken) {
    navigate("/login/teacher");
    return null;
  }

  if (!teacher) {
    return <Loader message="Loading teacher data..." />;
  }

  return (
    <div className="teacher-profile-container">
      <div className="teacher-profile-card">
        <Sidebar
          teacher={teacher}
          backendUrl={backendUrl}
          handlePasswordChangeNavigation={handlePasswordChangeNavigation}
          handleLogout={handleLogout}
        />
        <div className="teacher-profile-content">
          <div className="teacher-profile-tabs">
            <button
              className={`teacher-tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i> Profile
            </button>

            <button
              className={`teacher-tab-button ${activeTab === "attendance" ? "active" : ""}`}
              onClick={() => setActiveTab("attendance")}
            >
              <i className="fas fa-calendar-check"></i> Attendance
            </button>

            <button
              className={`teacher-tab-button ${activeTab === "salary" ? "active" : ""}`}
              onClick={() => setActiveTab("salary")}
            >
              <i className="fas fa-money-check-alt"></i> Salary Transactions
            </button>

            <button
              className={`teacher-tab-button ${activeTab === "bank" ? "active" : ""}`}
              onClick={() => setActiveTab("bank")}
            >
              <i className="fas fa-bank"></i> Update Bank Details
            </button>


          </div>

          {isLoading ? (
            <Loader message="Loading data..." />
          ) : (
            <>
              {activeTab === "profile" && <ProfileTab teacher={teacher} />}
              {activeTab === "salary" && (
                <SalaryTab
                  transactions={salaryTransactions}
                  currentPage={currentPage}
                  transactionsPerPage={transactionsPerPage}
                  handleAcknowledgeSalary={(transactionId) => 
                    handleAcknowledgeSalary(backendUrl, teacherToken, transactionId, setSalaryTransactions)
                  }
                  handlePageChange={handlePageChange}
                  error={error}
                />
              )}
              {activeTab === "bank" && (
                <BankTab
                  bankDetails={bankDetails}
                  handleBankInputChange={handleBankInputChange}
                  handleBankDetailsUpdate={(e) => 
                    handleBankDetailsUpdate(e, backendUrl, teacherToken, bankDetails, setTeacherData, setIsUpdatingBank)
                  }
                  isUpdatingBank={isUpdatingBank}
                />
              )}
              {activeTab === "attendance" && (
                <AttendanceTab
                  attendanceHistory={attendanceHistory}
                  filteredAttendance={filteredAttendance}
                  attendanceStats={attendanceStats}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  setSelectedMonth={setSelectedMonth}
                  setSelectedYear={setSelectedYear}
                  currentPage={currentPage}
                  attendancePerPage={attendancePerPage}
                  handleMarkAttendance={() => 
                    handleMarkAttendance(backendUrl, teacherToken, setIsLoading, setError, () => fetchAttendanceHistory(backendUrl, teacherToken, setIsLoading, setError, setAttendanceHistory, clearUserData, navigate))
                  }
                  handlePageChange={handlePageChange}
                  error={error}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;