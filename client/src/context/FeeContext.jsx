import { createContext } from "react";

export const FeeContext = createContext();

export const FeeContextProvider = ({ children }) => {
  const feeStructure = [
    {
      category: "english", // Match Student model medium enum
      fees: [
        { className: "nursery", amount: 3000 },
        { className: "kg", amount: 3000 },
        { className: "1", amount: 3500 },
        { className: "2", amount: 3500 },
        { className: "3", amount: 3500 },
        { className: "4", amount: 3500 },
        { className: "5", amount: 4000 },
        { className: "6", amount: 4000 },
        { className: "7", amount: 4000 },
        { className: "8", amount: 5000 },
        { className: "9", amount: 5000 },
        { className: "10", amount: 5000 },
      ],
    },
    {
      category: "assamese", // Match Student model medium enum
      fees: [
        { className: "ankur", amount: 1000 },
        { className: "mukul", amount: 1000 },
        { className: "1", amount: 1000 },
        { className: "2", amount: 1000 },
        { className: "3", amount: 1000 },
        { className: "4", amount: 1000 },
        { className: "5", amount: 1500 },
        { className: "6", amount: 1500 },
        { className: "7", amount: 1500 },
        { className: "8", amount: 2000 },
        { className: "9", amount: 2000 },
        { className: "10", amount: 2000 },
        { className: "11", amount: 3000 }, // Base fee for Assamese 11/12, adjusted by stream in Higher Secondary
        { className: "12", amount: 5000 }, // Base fee for Assamese 11/12, adjusted by stream in Higher Secondary
      ],
    },
    {
      category: "Higher Secondary",
      fees: [
        { className: "hs-arts-1", amount: 3000 },
        { className: "hs-arts-2", amount: 5000 },
        { className: "hs-science-1", amount: 10000 },
        { className: "hs-science-2", amount: 15000 },
      ],
    },
    {
      category: "Hostel Fees",
      fees: [
        { className: "hostel", amount: 3000 } // Simplified to a single hostel fee
      ],
    },
  ];

  const value = {
    feeStructure,
  };

  return <FeeContext.Provider value={value}>{children}</FeeContext.Provider>;
};