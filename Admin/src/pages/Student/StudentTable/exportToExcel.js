import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export function exportStudentsToExcel(students, classValue, medium, stream) {
  if (!Array.isArray(students) || students.length === 0) return;

  // Only export required columns
  const worksheetData = students.map(({ registrationNo, name }) => ({
    registrationNo,
    name,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  // Build filename
  let fileName = `students_${classValue}`;
  if (medium) fileName += `_${medium}`;
  if (stream) fileName += `_${stream}`;
  fileName += ".xlsx";

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([wbout], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
}

export default exportStudentsToExcel;