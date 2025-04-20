import axios from "axios";
import { toast } from "react-toastify";

export const fetchTeacherData = async (backendUrl, adminToken, teacherId, setTeacher, setFormData, setError) => {
  try {
    const response = await axios.get(`${backendUrl}/api/teacher/teacher/${teacherId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (response.data.success) {
      setTeacher(response.data.teacher);
      setFormData((prev) => ({ ...prev, amount: response.data.teacher.salary || "" }));
    } else {
      setError(response.data.message || "Failed to fetch teacher data.");
      setTeacher(null);
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    setError(error.response?.data?.message || "Error fetching teacher data.");
    setTeacher(null);
  }
};

export const fetchAttendanceData = async (backendUrl, adminToken, teacherId, setAttendance, setError) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/teacher/get-attendance-report`,
      { teacherId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (response.data.success) {
      setAttendance(response.data.attendanceReport.attendance || []);
    } else {
      setError(response.data.message || "Failed to fetch attendance data.");
      setAttendance([]);
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    setError(error.response?.data?.message || "Error fetching attendance data.");
    setAttendance([]);
  }
};

export const fetchTransactions = async (backendUrl, adminToken, teacherId, setTransactions, setError) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/teacher/get-all-transactions`,
      { teacherId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (response.data.success) {
      setTransactions(response.data.data || []);
    } else {
      setError(response.data.message || "Failed to fetch transactions.");
      setTransactions([]);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    setError(error.response?.data?.message || "Error fetching transactions.");
    setTransactions([]);
  }
};

export const recordPayment = async (backendUrl, adminToken, paymentData, setTransactions, setTeacher, setError) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/teacher/record-transaction`,
      paymentData,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (response.data.success) {
      toast.success("Payment recorded successfully!");
      const newTransaction = response.data.transaction;
      setTransactions((prev) => [newTransaction, ...prev]);
      setTeacher((prev) => ({ ...prev, dueBalance: prev.dueBalance - paymentData.amount }));
    } else {
      setError(response.data.message || "Failed to record payment.");
      toast.error(response.data.message || "Failed to record payment.");
    }
  } catch (error) {
    const message = error.response?.data?.message || "Error recording payment.";
    setError(message);
    toast.error(message);
  }
};

export const markAttendance = async (
  backendUrl,
  adminToken,
  teacherId,
  status,
  date,
  setAttendance,
  setError
) => {
  try {
    // Normalize date to midnight IST
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0); // Midnight IST
    const utcDate = new Date(
      Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
    );

    const response = await axios.post(
      `${backendUrl}/api/teacher/mark-attendance`,
      { teacherId, status, date: utcDate.toISOString() },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    if (response.data.success) {
      // Fetch fresh attendance data to sync UI
      await fetchAttendanceData(backendUrl, adminToken, teacherId, setAttendance, setError);
      toast.success(`Marked as ${status}`);
    } else {
      setError(response.data.message || "Failed to mark attendance.");
      toast.error(response.data.message || "Failed to mark attendance.");
    }
  } catch (error) {
    const message = error.response?.data?.message || "Error marking attendance.";
    setError(message);
    toast.error(message);
    throw new Error(message);
  }
};

export const unmarkAttendance = async (
  backendUrl,
  adminToken,
  teacherId,
  attendanceId,
  setAttendance,
  setError
) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/teacher/unmark-attendance`,
      { teacherId, attendanceId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (response.data.success) {
      setAttendance((prev) => prev.filter((att) => att._id !== attendanceId));
      toast.success("Attendance unmarked successfully");
    } else {
      setError(response.data.message || "Failed to unmark attendance.");
      toast.error(response.data.message || "Failed to unmark attendance.");
    }
  } catch (error) {
    const message = error.response?.data?.message || "Error unmarking attendance.";
    setError(message);
    throw new Error(message);
  }
};