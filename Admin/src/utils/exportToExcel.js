import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { capitalizeWords, capitalizeFirst } from "./utility";

export const exportToExcel = (students) => {
  if (!students.length) {
    toast.error("No students to export");
    return;
  }

const data = students.map((s) => ({
  Name: capitalizeWords(s.name || ""),
  "Registration No": s.registrationNo,
  Class: s.class,
  Medium: capitalizeFirst(s.medium || ""),
  ...(s.stream && {
    Stream: capitalizeFirst(s.stream),
  }),
}));


  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Students");

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Student_List_${date}.xlsx`);
};
