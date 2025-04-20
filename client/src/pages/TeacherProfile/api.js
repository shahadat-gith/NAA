import { toast } from "react-toastify";

export const fetchSalaryTransactions = async (
  backendUrl,
  teacherToken,
  teacherId,
  setIsLoading,
  setError,
  setSalaryTransactions,
  clearUserData,
  navigate
) => {
  setIsLoading(true);
  setError("");
  try {
    const response = await fetch(`${backendUrl}/api/teacher/get-all-transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({ teacherId }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success) {
      setSalaryTransactions(data.data || []);
    } else {
      setError(data.message || "Failed to fetch salary transactions");
      setSalaryTransactions([]);
    }
  } catch (error) {
    console.error("Error fetching salary transactions:", error);
    setError("Error fetching salary transactions. Please try again.");
    setSalaryTransactions([]);
    if (error.message.includes("401")) {
      clearUserData("teacher");
      navigate("/login/teacher");
    }
  } finally {
    setIsLoading(false);
  }
};

export const fetchAttendanceHistory = async (
  backendUrl,
  teacherToken,
  setIsLoading,
  setError,
  setAttendanceHistory,
  clearUserData,
  navigate
) => {
  setIsLoading(true);
  setError("");
  try {
    const response = await fetch(`${backendUrl}/api/teacher/attendance-history`, {
      method: "GET",
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success) {
      // Ensure single record per day by filtering latest
      const uniqueAttendance = [];
      const seenDates = new Set();
      for (const record of data.attendance.sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt))) {
        const dateStr = new Date(record.date).toISOString().split("T")[0];
        if (!seenDates.has(dateStr)) {
          seenDates.add(dateStr);
          uniqueAttendance.push(record);
        }
      }
      setAttendanceHistory(uniqueAttendance);
    } else {
      setError(data.message || "Failed to fetch attendance history");
      setAttendanceHistory([]);
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    setError("Error fetching attendance history. Please try again.");
    setAttendanceHistory([]);
    if (error.message.includes("401")) {
      clearUserData("teacher");
      navigate("/login/teacher");
    }
  } finally {
    setIsLoading(false);
  }
};

export const handleMarkAttendance = async (
  backendUrl,
  teacherToken,
  setIsLoading,
  setError,
  fetchAttendanceHistory
) => {
  setIsLoading(true);
  setError("");
  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Frontend Coordinates: (${latitude}, ${longitude}), Accuracy: ${accuracy} meters`);

        // Get current local date and normalize to midnight IST
        const now = new Date();
        // Create a date object for midnight IST
        const localDate = new Date(
          now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        localDate.setHours(0, 0, 0, 0); // Midnight IST

        // Convert to UTC ISO string (e.g., "2025-04-15T00:00:00.000Z")
        const utcDate = new Date(
          Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate()
          )
        );

        try {
          const response = await fetch(`${backendUrl}/api/teacher/mark-attendance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${teacherToken}`,
            },
            body: JSON.stringify({
              status: "Present",
              latitude,
              longitude,
              date: utcDate.toISOString(), // e.g., "2025-04-15T00:00:00.000Z"
            }),
          });

          const data = await response.json();
          if (data.success) {
            toast.success("Attendance marked as Present!");
            fetchAttendanceHistory();
          } else {
            toast.error(data.message || "Failed to mark attendance");
            setError(data.message || "Failed to mark attendance");
          }
        } catch (error) {
          console.error("Error during attendance request:", error);
          toast.error("Error marking attendance. Please try again.");
          setError("Error marking attendance.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Please enable location access to mark attendance";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please allow location permissions.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location unavailable. Please check your device settings.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }
        toast.error(errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    toast.error(error.message || "Error marking attendance");
    setError(error.message || "Error marking attendance");
    setIsLoading(false);
  }
};

export const handleAcknowledgeSalary = async (
  backendUrl,
  teacherToken,
  transactionId,
  setSalaryTransactions
) => {
  try {
    const response = await fetch(`${backendUrl}/api/teacher/acknowledge-salary/${transactionId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const data = await response.json();
    if (data.success) {
      setSalaryTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId ? { ...transaction, acknowledged: true } : transaction
        )
      );
      toast.success("Salary transaction acknowledged successfully!");
    } else {
      toast.error("Failed to acknowledge salary: " + data.message);
    }
  } catch (error) {
    console.error("Error acknowledging salary:", error);
    toast.error("Error acknowledging salary.");
  }
};

export const handleBankDetailsUpdate = async (
  e,
  backendUrl,
  teacherToken,
  bankDetails,
  setTeacherData,
  setIsUpdatingBank
) => {
  e.preventDefault();
  setIsUpdatingBank(true);
  try {
    const response = await fetch(`${backendUrl}/api/teacher/update-bank-details`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify(bankDetails),
    });

    const data = await response.json();
    if (data.success) {
      setTeacherData(data.teacher);
      toast.success("Bank details updated successfully!");
    } else {
      toast.error(data.message || "Failed to update bank details");
    }
  } catch (error) {
    console.error("Error updating bank details:", error);
    toast.error("Error updating bank details.");
  } finally {
    setIsUpdatingBank(false);
  }
};