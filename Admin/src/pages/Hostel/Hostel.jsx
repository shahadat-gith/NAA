import React, { useState, useEffect, useContext } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import ShowBoarders from "./ShowBoarders";
import BoarderProfile from "./BoarderProfile";
import TransactionDetails from "./TransactionDetails";
import "./Hostel.css";

const Hostel = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [hostelFee, setHostelFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTransactionsFor, setShowTransactionsFor] = useState(null);
  const [showCashPopupFor, setShowCashPopupFor] = useState(null);

  const fetchAllAdmissions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${backendUrl}/api/students`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const allStudents = response.data.students || [];
      const hostelStudents = allStudents.filter(student => student.hostel === "Yes");
      setAdmissions(hostelStudents);
      setFilteredAdmissions(hostelStudents);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching hostel students");
      toast.error(err.response?.data?.message || "Error fetching hostel students");
      setAdmissions([]);
      setFilteredAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleAdmission = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${backendUrl}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSelectedAdmission(response.data.student);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching student");
      toast.error(err.response?.data?.message || "Error fetching student");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = (student) => {
    if (student && student.payments) {
      const hostelTransactions = student.payments.filter(
        transaction => transaction.paymentType === "hosteladmissionfee" || transaction.paymentType === "hostelmonthlyfee"
      );
      setTransactions(hostelTransactions);
    } else {
      setTransactions([]);
    }
  };

  const fetchHostelFee = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/settings/settings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const fee = response.data.data?.hostelFee || 0;
      setHostelFee(fee);
      return fee;
    } catch (err) {
      console.error("Error fetching hostel fee:", err);
      setHostelFee(0);
      toast.error("Failed to fetch hostel fee");
      return 0;
    }
  };

  const handleCashPayment = async (e, studentId) => {
    e.preventDefault();
    if (!paymentAmount || paymentAmount <= 0) {
      toast.warn("Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `${backendUrl}/api/students/${studentId}/payments`,
        {
          amount: parseInt(paymentAmount),
          paymentType: "hostelmonthlyfee",
          paymentMode: "cash",
          month: getCurrentMonthString(),
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Cash payment recorded successfully!");
      setPaymentAmount("");
      setShowCashPopupFor(null);
      await fetchAllAdmissions();
      if (selectedAdmission && selectedAdmission._id === studentId) {
        await fetchSingleAdmission(studentId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error recording payment");
      toast.error(err.response?.data?.message || "Error recording payment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmission = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student from hostel management?")) return;
    try {
      setLoading(true);
      setError("");
      const response = await axios.put(
        `${backendUrl}/api/students/${id}/hostel/remove`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Student removed from hostel management!");
      setSelectedAdmission(null);
      await fetchAllAdmissions();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing student");
      toast.error(err.response?.data?.message || "Error removing student");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDue = async () => {
    if (!window.confirm("Are you sure you want to add monthly due to all hostel students?")) return;
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `${backendUrl}/api/students/update-hostel-dues`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success(response.data.message || "Monthly dues added to all hostel students!");
      await fetchAllAdmissions();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding due amount");
      toast.error(err.response?.data?.message || "Error adding due amount");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  useEffect(() => {
    fetchHostelFee();
    fetchAllAdmissions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = admissions.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdmissions(filtered);
    } else {
      setFilteredAdmissions(admissions);
    }
  }, [searchTerm, admissions]);

  return (
    <div className="hostel-admin-section">
      <div className="section-header">
        <h2>Hostel Management</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <ShowBoarders
        admissions={admissions}
        filteredAdmissions={filteredAdmissions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchSingleAdmission={fetchSingleAdmission}
        handleDeleteAdmission={handleDeleteAdmission}
        handleAddDue={handleAddDue}
        handleCashPayment={handleCashPayment}
        loading={loading}
        fetchTransactions={fetchTransactions}
        setShowTransactionsFor={setShowTransactionsFor}
        showCashPopupFor={showCashPopupFor}
        setShowCashPopupFor={setShowCashPopupFor}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        hostelFee={hostelFee}
      />

      {selectedAdmission && (
        <BoarderProfile
          selectedAdmission={selectedAdmission}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          handleCashPayment={handleCashPayment}
          fetchSingleAdmission={fetchSingleAdmission}
          fetchAllAdmissions={fetchAllAdmissions}
          loading={loading}
          setSelectedAdmission={setSelectedAdmission}
        />
      )}

      {showTransactionsFor && (
        <TransactionDetails
          transactions={transactions}
          fetchTransactions={fetchTransactions}
          selectedAdmission={showTransactionsFor}
          loading={loading}
          setShowTransactionsFor={setShowTransactionsFor}
        />
      )}
    </div>
  );
};

export default Hostel;