
// frontend: api.js
import { toast } from "react-hot-toast";

export const fetchStudents = async (backendUrl, adminToken, setStudents, setFilteredStudents) => {
  try {
    const response = await fetch(`${backendUrl}/api/students/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch students");
    }
    setStudents(data.students);
    setFilteredStudents(data.students);
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

export const addMonthlyFee = async (backendUrl, adminToken, classFilter, mediumFilter, streamFilter, fetchStudents) => {
  try {
    const response = await fetch(`${backendUrl}/api/students/update-monthly-dues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        className: classFilter,
        medium: mediumFilter,
        stream: streamFilter || "",
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add monthly fee");
    }
    toast.success(data.message);
    await fetchStudents();
  } catch (err) {
    toast.error(`Error: ${err.message}`);
    throw err;
  }
};

export const recordCashPayment = async (backendUrl, adminToken, student, cashAmount, paymentType, fetchStudents,setLoading) => {
  const amount = parseInt(cashAmount);
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  setLoading(true)
  try {

    const response = await fetch(`${backendUrl}/api/students/${student._id}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        amount,
        paymentType,
        month: paymentType.includes("monthly") ? currentMonth : undefined,
        paymentMode: "cash",
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to record cash payment");
    }

    toast.success(`Cash payment of ₹${amount} recorded for ${student.name}`);
    await fetchStudents();
    return {
      ...student,
      dues: {
        ...student.dues,
        monthlyDue: {
          ...student.dues.monthlyDue,
          amount: paymentType === "monthlyfee"
            ? Math.max(0, (student.dues?.monthlyDue?.amount || 0) - amount)
            : student.dues?.monthlyDue?.amount || 0,
        },
        hostelDue: {
          ...student.dues.hostelDue,
          amount: paymentType === "hostelmonthlyfee"
            ? Math.max(0, (student.dues?.hostelDue?.amount || 0) - amount)
            : student.dues?.hostelDue?.amount || 0,
        },
      },
      payments: [
        ...student.payments,
        {
          _id: data.transaction?._id || new Date().toISOString(),
          amount,
          paymentType,
          month: paymentType.includes("monthly") ? currentMonth : undefined,
          paymentMode: "cash",
          status: "completed",
          paymentDate: new Date(),
        },
      ],
    };
  } catch (err) {
    toast.error(`Error: ${err.message}`);
    throw err;
  }
  finally{
    setLoading(false)
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
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete student");
    }
    toast.success("Student deleted successfully");
  } catch (err) {
    toast.error(err.message);
    throw err;
  }
};

const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};

