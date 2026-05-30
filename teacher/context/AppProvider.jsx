import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { AppContext } from "./AppContext";
import api from "@/configs/api";

const AppProvider = ({ children }) => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [teacher, setTeacher] = useState(null);
  const [sessionChecking, setSessionChecking] = useState(true);

  const loadTeacher = async () => {
    try {
      const token = await SecureStore.getItemAsync("teacher-token");

      if (!token) {
        setTeacher(null);
        return null;
      }

      const response = await api.get("/api/auth/teacher/me");

      if (response.data?.success && response.data?.teacher) {
        setTeacher(response.data.teacher);
        return response.data.teacher;
      }

      setTeacher(null);
      await SecureStore.deleteItemAsync("teacher-token");
      return null;
    } catch (error) {
      console.log("loadTeacher error:", error?.response?.data || error?.message);
      setTeacher(null);
      await SecureStore.deleteItemAsync("teacher-token");
      return null;
    } finally {
      setSessionChecking(false);
    }
  };

  useEffect(() => {
    loadTeacher();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        teacher,
        setTeacher,
        sessionChecking,
        setSessionChecking,
        loadTeacher,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;