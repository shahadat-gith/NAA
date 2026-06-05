import api from "../configs/api";

const handleApiError = (error) => {
  if (error?.response?.data) {
    const backendMessage =
      error.response.data.message || error.response.data.error;

    if (backendMessage && backendMessage.includes("Illegal arguments")) {
      return "An incorrect password was entered.";
    }

    if (backendMessage) return backendMessage;
  }

  if (error?.request) {
    return "Cannot connect to the server. Please check your internet connection and try again.";
  }

  return error?.message || "Something went wrong. Please try again.";
};

export const staffApi = {
  login: async (contact, password) => {
    try {
      const { data } = await api.post("/api/auth/staff-login", {
        contact,
        password,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("staff-token");
      if (api.defaults.headers.common["Authorization"]) {
        delete api.defaults.headers.common["Authorization"];
      }
      return { success: true };
    } catch (error) {
      console.error("Local token eviction failure context:", error);
      return { success: false, error: error.message };
    }
  },

  sendForgotOtp: async (email) => {
    try {
      const { data } = await api.post(
        "/api/auth/forgot-password/staff/send-otp",
        {
          email,
        },
      );
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  verifyForgotOtp: async (email, otp) => {
    try {
      const { data } = await api.post(
        "/api/auth/forgot-password/staff/verify-otp",
        {
          email,
          otp,
        },
      );
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  resetPassword: async (email, newPassword) => {
    try {
      const { data } = await api.post(
        "/api/auth/forgot-password/staff/reset-password",
        {
          email,
          newPassword,
        },
      );
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  inAppUpdatePassword: async (newPassword) => {
    try {
      const { data } = await api.put("/api/auth/staff/update-password", {
        newPassword,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  getDashboard: async () => {
    try {
      const { data } = await api.get("/api/staff/dashboard");
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  getProfile: async () => {
    try {
      const { data } = await api.get("/api/staff/profile");
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  updateProfile: async (formData) => {
    try {
      const { data } = await api.put("/api/staff/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  markAttendance: async (token, markedBy = "Staff", status = "Present") => {
    try {
      const { data } = await api.post("/api/attendance/mark-attendance", {
        token,
        markedBy,
        status,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  getAttendanceHistory: async (month, year) => {
    try {
      const params = month && year ? { month, year } : {};
      const { data } = await api.get("/api/attendance/history/me", { params });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  updateTimetable: async (day, schedule) => {
    try {
      const { data } = await api.put("/api/staff/timetable/update", {
        day,
        schedule,
      });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },

  getTimetable: async () => {
    try {
      const { data } = await api.get("/api/staff/timetable/me");
      return data;
    } catch (error) {
      throw new Error(handleApiError(error), { cause: error });
    }
  },
};