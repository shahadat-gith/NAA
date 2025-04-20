import { toast } from "react-toastify";

export const fetchStudents = async (backendUrl, adminToken, setStudents, setFilteredStudents) => {
  try {
    const response = await fetch(`${backendUrl}/api/students/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch students");
    if (data.success) {
      setStudents(data.data);
      setFilteredStudents(data.data);
    } else {
      throw new Error(data.message || "Failed to fetch students");
    }
  } catch (err) {
    toast.error(err.message);
  }
};

export const fetchAdmitCardConfig = async (backendUrl, adminToken, setAdmitCardConfig) => {
  try {
    const response = await fetch(`${backendUrl}/api/settings/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (data.success) {
      setAdmitCardConfig(data.data.admitCardConfig);
    } else {
      toast.error(data.message || "Failed to load settings");
    }
  } catch (err) {
    toast.error("Failed to load settings: " + err.message);
  }
};

export const addMonthlyFee = async (backendUrl,adminToken, classFilter, mediumFilter, streamFilter, fetchStudents) => {
  try {
    const response = await fetch(`${backendUrl}/api/students/add-monthly-fee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        class: classFilter,
        medium: mediumFilter,
        stream: streamFilter || "",
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add monthly fee");
    toast.success(
      `Monthly fee added to all students in ${formatClassName(classFilter)}${
        streamFilter ? ` (${streamFilter})` : ""
      }`
    );
    await fetchStudents();
  } catch (err) {
    toast.error(err.message);
  }
};

export const recordCashPayment = async (backendUrl, adminToken, student, cashAmount, paymentType, fetchStudents) => {
  const dueField = paymentType.includes("hostel") ? "hostelDueAmount" : "dueAmount";
  const currentMonth = `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`;
  try {
    const response = await fetch(`${backendUrl}/api/students/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        studentId: student._id,
        amount: parseInt(cashAmount),
        paymentType,
        month: paymentType.includes("monthly") ? currentMonth : undefined,
        paymentMode: "cash",
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to record cash payment");

    toast.success(`Cash payment of ₹${cashAmount} recorded for ${student.firstName} ${student.lastName}`);
    await fetchStudents();
    return {
      ...student,
      [dueField]: student[dueField] - cashAmount,
      payments: [
        ...student.payments,
        data.data.transaction || {
          amount: cashAmount,
          paymentType,
          month: paymentType.includes("monthly") ? currentMonth : undefined,
          paymentMode: "cash",
          status: "completed",
          paymentDate: new Date(),
        },
      ],
    };
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
};

export const deleteStudent = async (backendUrl, adminToken, studentId) => {
  try {
    const response = await fetch(`${backendUrl}/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete student");
    toast.success("Student deleted successfully");
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
};

// Helper function used in addMonthlyFee
const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};