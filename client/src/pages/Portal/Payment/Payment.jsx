import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { getCurrentAcademicSession } from "../../../Utils/utility";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const academicSession = getCurrentAcademicSession(4); // April-based session
  const { studentId } = location?.state || {};

  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [dues, setDues] = useState([]);

  /* ================= FETCH STUDENT + ADMISSION + DUES ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/student/single/${studentId}`,
          { params: { academicSession } }
        );

        if (!res.data.success) {
          toast.error("Failed to load student details");
          return;
        }

        setStudent(res.data.student);
        setAdmission(res.data.admission);
        setDues(res.data.dues || []);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching payment details");
      }
    };

    fetchDetails();
  }, [studentId, academicSession, backendUrl]);

  /* ================= HANDLE PAYMENT ================= */
  const handlePayment = async (feeType) => {
    try {
      setLoading(true);

      if (!student || !admission) {
        toast.error("Student or admission data missing");
        return;
      }

      const { class: studentClass, medium, stream } = student;

      /* ---------- CREATE ORDER ---------- */
      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        {
          type: feeType,
          class: studentClass,
          medium,
          stream: stream || null,
        }
      );

      if (!data.success) {
        toast.error("Failed to create order");
        return;
      }

      const { order, key } = data;

      /* ---------- RAZORPAY ---------- */
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Nashib Ali Academy",
        description: `${feeType} payment`,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/payment-verification`,
              {
                ...response,
                studentId,
                academicSession,
                feeType,
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful 🎉");

              navigate("/portal/payment-success", {
                state: {
                  payment: verifyRes.data.payment,
                  student: verifyRes.data.student,
                },
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification error");
          }
        },

        theme: {
          color: "#e94560",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VALIDATION ================= */
  if (!studentId) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">
            <h2><i className="fas fa-exclamation-triangle"></i> Invalid Payment Request</h2>
            <p>No student information found. Please go back and try again.</p>
            <button className="back-btn" onClick={() => navigate("/portal")}>
              <i className="fas fa-arrow-left"></i> Go to Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const admissionDue = dues.find((d) => d.type === "admissionFee");
  const monthlyDue = dues.find((d) => d.type === "monthlyFee");

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title">Student Payment</h1>

        {/* ================= STUDENT DETAILS CARD ================= */}
        {student && (
          <div className="info-card student-card">
            <div className="card-header">
              <h2><i className="fas fa-user"></i> Student Details</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{student.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Registration No</span>
                <span className="info-value registration-no">
                  {student.registrationNo}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Class</span>
                <span className="info-value">{student.class}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Medium</span>
                <span className="info-value capitalize">{student.medium}</span>
              </div>
              {student.stream && (
                <div className="info-row">
                  <span className="info-label">Stream</span>
                  <span className="info-value capitalize">
                    {student.stream}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ADMISSION DETAILS CARD ================= */}
        {admission && (
          <div className="info-card admission-card">
            <div className="card-header">
              <h2><i className="fas fa-clipboard-list"></i> Admission Details</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Academic Session</span>
                <span className="info-value">{admission.academicSession}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className={`status-badge ${admission.status}`}>
                  {admission.status}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Admission Fee Paid</span>
                <span
                  className={`payment-status ${
                    admission.isAdmissionFeePaid ? "paid" : "unpaid"
                  }`}
                >
                  {admission.isAdmissionFeePaid ? "✓ Yes" : "✗ No"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= DUES CARD ================= */}
        <div className="info-card dues-card">
          <div className="card-header">
            <h2><i className="fas fa-money-bill-wave"></i> Fee Dues</h2>
          </div>
          <div className="card-body">
            <div className="due-item">
              <div className="due-info">
                <span className="due-label">Admission Fee Due</span>
                <span className="due-amount">
                  ₹{admissionDue?.dueAmount || 0}
                </span>
              </div>
            </div>
            <div className="due-item">
              <div className="due-info">
                <span className="due-label">Monthly Fee Due</span>
                <span className="due-amount">
                  ₹{monthlyDue?.dueAmount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAYMENT BUTTONS ================= */}
        <div className="payment-actions">
          <button
            onClick={() => handlePayment("admissionFee")}
            disabled={
              loading || !admissionDue || admissionDue.dueAmount === 0
            }
            className={`payment-btn ${
              admissionDue?.dueAmount > 0 ? "active" : "disabled"
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <i className="fas fa-graduation-cap btn-icon"></i>
                <span>Pay Admission Fee</span>
              </>
            )}
          </button>

          <button
            onClick={() => handlePayment("monthlyFee")}
            disabled={loading || !monthlyDue || monthlyDue.dueAmount === 0}
            className={`payment-btn ${
              monthlyDue?.dueAmount > 0 ? "active" : "disabled"
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <i className="fas fa-calendar-alt btn-icon"></i>
                <span>Pay Monthly Fee</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;