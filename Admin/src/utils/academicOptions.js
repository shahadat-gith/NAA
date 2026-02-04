
export const CLASS_OPTIONS = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};


export const STREAM_OPTIONS = ["science", "arts"];
export const MEDIUM_OPTIONS = ["english", "assamese"];

export const EXAM_OPTIONS = [
  "Half Yearly Examination",
  "Annual Examination",
  "Unit Test 1",
  "Unit Test 2",
  "Unit Test 3",
  "Unit Test 4",
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
  "Diniyaat"
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