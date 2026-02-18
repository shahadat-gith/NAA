
export const CLASS_OPTIONS = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};


export const STREAM_OPTIONS = ["science", "arts"];


export const EXAM_OPTIONS = [
  "Half Yearly Examination",
  "Annual Examination",
  "Unit Test 1",
  "Unit Test 2",
  "Unit Test 3",
  "Unit Test 4",
];

export const TIME_OPTIONS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

export const EXAM_CENTER_OPTIONS = [
  "Nashib Ali Academy North Building",
  "Nashib Ali Academy South Building",
];




export const SUBJECT_OPTIONS = [
  "English",
  "General Science",
  "Mathematics",
  "Drawing/Handwriting",
  "Assamese",
  "GK",
  "EVS",
  "Social Studies",
  "Arabic",
  "Hindi",
  "Computer",
  "Drawing",
  "Advance Mathematics",
  "Geography",
  "Garments Design",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Advance Assamese",
  "Alternative English",
  "Education",
  "Political Science",
  "Retail Management",
  "Diniyaat",
  "Elective",
  "G.K / Drawing",
  "Parivesh",
  "Oral",
  "New Science",
  "Social Science",
  "MIL",
  "MIL / Alternative English",
  "Environmental Education",
  "Advance Assamese / Arabic",
];



export const generateAcademicSessions = (years = 5) => {
  const startYear = new Date().getFullYear();
  return Array.from({ length: years }, (_, i) => {
    const y1 = startYear + i;
    const y2 = y1 + 1;
    return `${y1}-${y2}`;
  });
};

// usage
export const SESSION_OPTIONS = generateAcademicSessions(5);


  export const academicSessions = [
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
  ];