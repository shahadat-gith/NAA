import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { backendUrl } = useContext(AppContext);
  const [studentToken, setStudentToken] = useState(localStorage.getItem("studentToken") || null);
  const [teacherToken, setTeacherToken] = useState(localStorage.getItem("teacherToken") || null);
  const [studentData, setStudentData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  const fetchUserData = async (role, token) => {
    const endpoint = role === "student" ? "/api/auth/student/me" : "/api/auth/teacher/me";
    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        if (role === "student") {
          setStudentData(data.data);
        } else {
          setTeacherData(data.data);
        }
      } else {
        console.error(`Failed to fetch ${role} data:`, data.message);
        if (role === "student") setStudentData(null);
        else setTeacherData(null);
      }
    } catch (error) {
      console.error(`Error fetching ${role} data:`, error.message);
      if (role === "student") setStudentData(null);
      else setTeacherData(null);
    }
  };

  useEffect(() => {
    if (studentToken) fetchUserData("student", studentToken);
    if (teacherToken) fetchUserData("teacher", teacherToken);
  }, [studentToken, teacherToken, backendUrl]);

  const saveUserData = (role, token, rememberMe) => {
    console.log(`Saving ${role} token:`, token); // Debug log
    if (role === "student") {
      setStudentToken(token);
      if (rememberMe) localStorage.setItem("studentToken", token);
      else localStorage.removeItem("studentToken");
    } else if (role === "teacher") {
      setTeacherToken(token);
      if (rememberMe) localStorage.setItem("teacherToken", token);
      else localStorage.removeItem("teacherToken");
    }
  };

  const clearUserData = (role) => {
    if (role === "student") {
      setStudentToken(null);
      setStudentData(null);
      localStorage.removeItem("studentToken");
    } else if (role === "teacher") {
      setTeacherToken(null);
      setTeacherData(null);
      localStorage.removeItem("teacherToken");
    }
  };

  const value = {
    studentToken,
    setStudentToken,
    teacherToken,
    setTeacherToken,
    studentData,
    setStudentData,
    teacherData,
    setTeacherData,
    saveUserData,
    clearUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);