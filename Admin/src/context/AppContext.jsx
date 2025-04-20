import { createContext, useState, useEffect, useContext } from "react";
import { AdminContext } from "./AdminContext";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [admissions, setAdmissions] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState(0);
  const [approvedAdmissions, setApprovedAdmissions] = useState(0);

  const { adminToken ,backendUrl} = useContext(AdminContext);

  // const fetchAdmissions = async () => {
  //   try {
  //     const response = await axios.get(`${backendUrl}/api/admission/get-all-admissions`,
  //       {headers: { Authorization: `Bearer ${adminToken}` },}
  //     );
  //     if (response.data.success) {
  //       const formattedAdmissions = response.data.data.map(admission => ({
  //         _id: admission._id,
  //         name: `${admission.firstName} ${admission.lastName}`, // Construct name
  //         email: admission.email || 'N/A', // Fallback if not present
  //         phone: admission.guardianContact,
  //         gender: admission.gender,
  //         dob: new Date(admission.dob).toLocaleDateString('en-IN'),
  //         medium: admission.medium,
  //         address: admission.address,
  //         fatherName: admission.fatherName,
  //         fatherOccupation: admission.parentsOccupation, // Adjust based on schema
  //         motherName: admission.motherName,
  //         motherOccupation: admission.parentsOccupation, // Adjust based on schema
  //         district: admission.district,
  //         state: admission.state,
  //         pincode: admission.pincode,
  //         hostel: admission.hostel,
  //         class: admission.class,
  //         previousSchool: admission.previousSchool || 'N/A', // Fallback if not present
  //         previousClass: admission.previousClass || 'N/A', // Fallback if not present
  //         status: admission.status,
  //         image: admission.image,
  //         dueAmount: admission.dueAmount, // Include dueAmount
  //       }));
  //       setAdmissions(formattedAdmissions);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching admissions:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAdmissions();
  // }, []);

  // useEffect(() => {
  //   if (adminToken) {
  //     fetchAdmissions();
  //   }
  // }, [adminToken]);

  const value = {
    admissions,
    setAdmissions,
    pendingAdmissions,
    setPendingAdmissions,
    approvedAdmissions,
    setApprovedAdmissions,
    backendUrl,
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext); // Optional utility hook
