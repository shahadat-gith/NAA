export const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};



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
];


export const SESSION_OPTIONS = [
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
  ];

export const FORM_FIELDS = [
  { label: "Student Name", name: "name", type: "text", isRequired: true },
  { label: "Father's Name", name: "fatherName", type: "text", isRequired: true },
  { label: "Mother's Name", name: "motherName", type: "text", isRequired: true },
  { label: "Date of Birth", name: "dob", type: "date", isRequired: true },

  {
    label: "Gender",
    name: "gender",
    type: "select",
    isRequired: true,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },

  { label: "Phone", name: "phone", type: "text", isRequired: true },
  { label: "Aadhar", name: "aadhar", type: "text", isRequired: false },
  { label: "PEN", name: "pen", type: "text", isRequired: false },

  {
    label: "Medium",
    name: "medium",
    type: "select",
    isRequired: true,
    options: [
      { label: "English", value: "english" },
      { label: "Assamese", value: "assamese" },
    ],
  },
];

export const ADDRESS_FIELDS = [
  { label: "Village", name: "village", isRequired: true },
  { label: "Post Office", name: "postOffice", isRequired: true },
  { label: "Police Station", name: "policeStation", isRequired: true },
  { label: "District", name: "district", isRequired: true },
  { label: "State", name: "state", isRequired: true },
  { label: "Pincode", name: "pincode", isRequired: true },
];



/**
 * Capitalizes the first letter of each word in a sentence
 * @param {string} text
 * @returns {string}
 */
const capitalizeWords = (text = "") => {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export default capitalizeWords;



