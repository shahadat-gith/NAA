import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { AdminContext } from "../../context/AdminContext";
import * as XLSX from "xlsx";
import "./Admission.css";

const Admissions = () => {
  const { backendUrl } = useContext(AppContext);
  const { adminToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);
  const [showCashModal, setShowCashModal] = useState(false);
  const [admissionToPay, setAdmissionToPay] = useState(null);
  const [cashAmount, setCashAmount] = useState("");

  useEffect(() => {
    const loadAdmissions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/students/`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (response.data.success) {
          console.log("Fetched students:", response.data.data); // Debug log
          // Filter only new admissions
          const newAdmissions = response.data.data.filter(student => student.isNewAdmission === true);
          setAdmissions(newAdmissions);
        } else {
          toast.error("Failed to fetch students");
        }
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };
    loadAdmissions();
  }, [backendUrl, adminToken]);

  const exportToExcel = () => {
    const exportData = admissions.map((admission) => ({
      "First Name": admission.firstName,
      "Last Name": admission.lastName,
      Phone: admission.phone,
      Gender: admission.gender,
      "Date of Birth": admission.dob,
      Medium: admission.medium,
      Address: admission.address,
      "Father's Name": admission.fatherName,
      "Mother's Name": admission.motherName,
      District: admission.district,
      State: admission.state,
      Pincode: admission.pincode,
      Hostel: admission.hostel,
      Class: admission.class,
      Status: admission.admissionStatus || "Pending", // Use admissionStatus
      "Due Amount": admission.dueAmount,
      "Is New Admission": admission.isNewAdmission ? "Yes" : "No", // Include isNewAdmission
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "New Admissions");
    XLSX.writeFile(workbook, `New_Admissions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleVerify = async (id, newStatus) => {
    const verifyPromise = axios.put(
      `${backendUrl}/api/students/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    toast.promise(verifyPromise, {
      pending: "Updating admission status...",
      success: {
        render({ data }) {
          if (data.data.success) {
            setAdmissions((prev) =>
              prev.map((admission) =>
                admission._id === id ? { ...admission, admissionStatus: newStatus } : admission
              )
            );
            return `Admission status updated to ${newStatus}`;
          }
          return "Failed to update status";
        },
      },
      error: {
        render({ data }) {
          return `Error updating status: ${data?.message || "Unknown error"}`;
        },
      },
    }).catch(() => {});
  };

  const openDeleteModal = (admission) => {
    setAdmissionToDelete(admission);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAdmissionToDelete(null);
  };

  const confirmDelete = async () => {
    if (!admissionToDelete) return;

    const deletePromise = axios.delete(`${backendUrl}/api/students/${admissionToDelete._id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    toast.promise(deletePromise, {
      pending: "Deleting admission record...",
      success: {
        render({ data }) {
          if (data.data.success) {
            setAdmissions((prev) =>
              prev.filter((admission) => admission._id !== admissionToDelete._id)
            );
            closeDeleteModal();
            return "Admission record deleted successfully";
          }
          return "Failed to delete admission record";
        },
      },
      error: {
        render({ data }) {
          closeDeleteModal();
          return `Error deleting admission record: ${data?.message || "Unknown error"}`;
        },
      },
    }).catch(() => {});
  };

  const openCashModal = (admission) => {
    setAdmissionToPay(admission);
    setCashAmount(admission.dueAmount > 0 ? admission.dueAmount.toString() : "");
    setShowCashModal(true);
  };

  const closeCashModal = () => {
    setShowCashModal(false);
    setAdmissionToPay(null);
    setCashAmount("");
  };

  const handleCashPayment = async () => {
    if (!admissionToPay) return;

    const amount = parseFloat(cashAmount);
    if (!amount || amount <= 0) {
      toast.warn("Please enter a valid amount");
      return;
    }
    if (amount > admissionToPay.dueAmount) {
      toast.warn("Amount cannot exceed the due amount");
      return;
    }

    const cashPaymentPromise = axios.post(
      `${backendUrl}/api/students/payment`,
      {
        studentId: admissionToPay._id,
        amount,
        paymentType: "admissionfee", // Updated to match Student model
        paymentMode: "cash", // Explicitly set as cash
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    toast.promise(cashPaymentPromise, {
      pending: "Recording cash payment...",
      success: {
        render({ data }) {
          if (data.data.success) {
            setAdmissions((prev) =>
              prev.map((admission) =>
                admission._id === admissionToPay._id
                  ? { ...admission, dueAmount: Math.max(0, admission.dueAmount - amount) }
                  : admission
              )
            );
            closeCashModal();
            return "Cash payment recorded successfully";
          }
          return "Failed to record cash payment";
        },
      },
      error: {
        render({ data }) {
          return `Error recording cash payment: ${data?.message || "Unknown error"}`;
        },
      },
    }).catch(() => {});
  };

  const handleNameClick = (id) => {
    navigate(`/admin/admission/${id}`);
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const fullName = `${admission.firstName} ${admission.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "All" || admission.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const classOptions = [
    "All",
    "nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", // Updated to match Student model
    "ankur", "mukul",
  ];

  return (
    <div className="admissions-container">
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete the admission record for{" "}
              <strong>{admissionToDelete?.firstName} {admissionToDelete?.lastName}</strong>?
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCashModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Record Cash Payment</h3>
            <p>
              Enter the cash payment amount for{" "}
              <strong>{admissionToPay?.firstName} {admissionToPay?.lastName}</strong>.
            </p>
            <p>Due Amount: ₹{admissionToPay?.dueAmount}</p>
            <div className="modal-input">
              <label>Amount (₹):</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                min="0"
                placeholder="Enter amount"
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeCashModal}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={handleCashPayment}>
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admissions-header">
        <h1>New Student Admissions</h1> {/* Updated title */}
        <div className="admissions-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="status-filter"
            >
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className === "All" ? "All Classes" : className}
                </option>
              ))}
            </select>
          </div>
          <button onClick={exportToExcel} className="export-btn">
            Export to Excel
          </button>
        </div>
      </div>

      {filteredAdmissions.length === 0 ? (
        <div className="no-admissions">
          <p>No new admissions found matching your criteria.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admissions-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Class</th>
                <th>Due Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map((admission) => (
                <tr key={admission._id}>
                  <td>
                    <img
                      src={admission.image ? `${backendUrl}/${admission.image}` : "/placeholder-image.jpg"}
                      alt={`${admission.firstName}'s image`}
                      className="admission-image"
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  </td>
                  <td
                    onClick={() => handleNameClick(admission._id)}
                    className="admission-name"
                  >
                    {admission.firstName} {admission.lastName}
                  </td>
                  <td>{admission.class}</td>
                  <td>₹{admission.dueAmount}</td>
                  <td>
                    <span className={`status-badge ${admission.admissionStatus ? admission.admissionStatus.toLowerCase() : "pending"}`}>
                      {admission.admissionStatus || "Pending"}
                    </span>
                  </td>
                  <td className="action-buttons-admission">
                    <button
                      onClick={() => handleVerify(admission._id, "Approved")}
                      className="action-btn accept-btn"
                      disabled={admission.admissionStatus === "Approved"}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleVerify(admission._id, "Rejected")}
                      className="action-btn reject-btn"
                      disabled={admission.admissionStatus === "Rejected"}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => openDeleteModal(admission)}
                      className="action-btn delete-btn"
                      disabled={admission.admissionStatus === "Approved"}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openCashModal(admission)}
                      className="action-btn cash-btn"
                      disabled={admission.admissionStatus !== "Approved" || admission.dueAmount <= 0}
                    >
                      Record Cash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admissions;