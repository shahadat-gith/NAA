import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [teachers, setTeachers] = useState([]);

    const getAllTeachers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/teacher/all-teachers`);

            if (data.success) {
                setTeachers(data.teachers);
            } else {
                console.error("Error fetching teachers data!");
            }
        } catch (error) {
            console.error("API Error:", error.message);
        }
    };

    const value = {
        backendUrl,
        teachers,
        getAllTeachers,
        setTeachers,
        adminUrl
    }

    useEffect(() => {
       
        getAllTeachers();
        
    }, [backendUrl]); 

  

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
