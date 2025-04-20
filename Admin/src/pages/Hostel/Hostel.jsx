import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import ShowAdmissions from "./ShowAdmissions";
import AdmissionProfile from "./AdmissionProfile";
import TransactionDetails from "./TransactionDetails";
import "./Hostel.css";

const Hostel = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [hostelFee, setHostelFee] = useState(0); // State for hostelFee
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
      console.log("Students response:", response.data);
      const allStudents = response.data.data || [];
      const hostelStudents = allStudents.filter(student => student.hostel === "Yes");
      setAdmissions(hostelStudents);
      setFilteredAdmissions(hostelStudents);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching hostel students");
      console.error("Error fetching students:", err);
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
      console.log("Single student response:", response.data);
      setSelectedAdmission(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching student");
      toast.error(err.response?.data?.message || "Error fetching student");
      console.error("Error fetching single student:", err);
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
      console.log("Filtered hostel transactions:", hostelTransactions);
    } else {
      setTransactions([]);
      console.log("No payments found for student:", student);
    }
  };

  const fetchHostelFee = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/settings/settings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log("Settings response on mount:", response.data);
      const fee = response.data.data?.hostelFee || 0;
      setHostelFee(fee);
      return fee;
    } catch (err) {
      console.error("Error fetching hostel fee:", err);
      setHostelFee(0); // Fallback to 0 on error
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
        `${backendUrl}/api/students/payment`,
        {
          studentId,
          month: `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`,
          amount: parseInt(paymentAmount),
          paymentType: "hostelmonthlyfee",
          paymentMode: "cash",
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      console.log("Payment response:", response.data);
      toast.success("Cash payment recorded successfully!");
      setPaymentAmount("");
      setShowCashPopupFor(null);
      fetchAllAdmissions();
      if (selectedAdmission && selectedAdmission._id === studentId) {
        fetchSingleAdmission(studentId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error recording payment");
      toast.error(err.response?.data?.message || "Error recording payment");
      console.error("Error recording payment:", err);
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
        null, 
        { headers: { Authorization: `Bearer ${adminToken}` } } 
      );
      console.log("Delete response:", response.data);
      toast.success("Student removed from hostel management!");
      setSelectedAdmission(null);
      fetchAllAdmissions();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing student");
      toast.error(err.response?.data?.message || "Error removing student");
      console.error("Error removing student:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDue = async () => {
    if (!window.confirm("Are you sure you want to add monthly due to all hostel students?")) return;
    try {
      setLoading(true);
      setError("");

      // Fetch the latest hostelFee
      const settingsResponse = await axios.get(`${backendUrl}/api/settings/settings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const fetchedHostelFee = settingsResponse.data.data?.hostelFee || 0;

      if (!fetchedHostelFee) {
        throw new Error("Hostel fee not configured in settings");
      }

      setHostelFee(fetchedHostelFee); // Update state with latest value

      await Promise.all(
        admissions.map(async (student) => {
          const updateResponse = await axios.put(
            `${backendUrl}/api/students/${student._id}/due`,
            { hostelDueAmount: (student.hostelDueAmount || 0) + fetchedHostelFee },
            { headers: { Authorization: `Bearer ${adminToken}` } }
          );
          console.log(`Update response for student ${student._id}:`, updateResponse.data);
        })
      );
      toast.success(`Due amount of ₹${fetchedHostelFee} added to all hostel students!`);
      fetchAllAdmissions();
    } catch (err) {
      console.error("Error in handleAddDue:", err);
      setError(err.response?.data?.message || err.message || "Error adding due amount");
      toast.error(err.response?.data?.message || err.message || "Error adding due amount");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostelFee(); // Fetch hostelFee on mount
    fetchAllAdmissions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = admissions.filter((student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
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

      <ShowAdmissions
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
        hostelFee={hostelFee} // Pass hostelFee to ShowAdmissions
      />

      {selectedAdmission && (
        <AdmissionProfile
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