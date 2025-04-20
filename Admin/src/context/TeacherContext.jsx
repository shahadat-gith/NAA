import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "./AdminContext";
import { useContext } from "react";


export const TeacherContext = createContext();

export const TeacherContextProvider = ({ children }) => {
    
    const [teachers, setTeachers] = useState([]);
    const { adminToken,backendUrl } = useContext(AdminContext);
    

    const getAllTeachers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/teacher/all-teachers`,
                {headers: { Authorization: `Bearer ${adminToken}` }},
            );

            if (data.success) {
                setTeachers(data.teachers);
            } else {
                console.error("Error fetching teachers data!");
            }
        } catch (error) {
            console.error("API Error:", error.message);
        }
    };

    const teacherCount = teachers.length


    

    const value = {
        backendUrl, 
        teachers, 
        getAllTeachers,
        teacherCount
  
    }
   

    useEffect(() => {
        getAllTeachers();
    }, [backendUrl]); // Ensures it refetches if backendUrl changes

    return (
        <TeacherContext.Provider value={value}>
            {children}
        </TeacherContext.Provider>
    );
};
