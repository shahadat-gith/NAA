import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { capitalizeWords, capitalizeFirst } from "./utility";

export const exportToExcel = (students) => {
  if (!students.length) {
    toast.error("No students to export");
    return;
  }

  const data = students.map((s) => ({
    /* ================= BASIC ================= */
    Name: capitalizeWords(s.name || ""),
    Class: s.class,
    Medium: capitalizeFirst(s.medium || ""),
    Stream: capitalizeFirst(s.stream || ""),
    Gender: capitalizeFirst(s.gender || ""),
    "Date of Birth": s.dob || "",

    /* ================= PARENTS ================= */
    "Father Name": capitalizeWords(s.fatherName || ""),
    "Mother Name": capitalizeWords(s.motherName || ""),

    /* ================= CONTACT ================= */
    Phone: s.phone || "",
    Aadhar: s.aadhar || "",
    PEN: s.pen || "",

    /* ================= ACADEMIC ================= */
    "Registration No": s.registrationNo || "",
    "Active Status": s.isActive ? "Yes" : "No",

    /* ================= ADDRESS (FLATTENED) ================= */
    "address.village": s.address?.village
      ? capitalizeWords(s.address.village)
      : "",
    "address.postOffice": s.address?.postOffice
      ? capitalizeWords(s.address.postOffice)
      : "",
    "address.policeStation": s.address?.policeStation
      ? capitalizeWords(s.address.policeStation)
      : "",
    "address.district": s.address?.district
      ? capitalizeWords(s.address.district)
      : "",
    "address.state": s.address?.state
      ? capitalizeWords(s.address.state)
      : "",
    "address.pincode": s.address?.pincode || "",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Students");

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Student_List_${date}.xlsx`);
};
