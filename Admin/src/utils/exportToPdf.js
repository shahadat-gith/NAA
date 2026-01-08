import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { capitalizeWords, capitalizeFirst } from "./utility";

export const exportToPdf = (students) => {
  if (!students.length) {
    toast.error("No students to export");
    return;
  }

  // Assume same class/medium/stream
  const { class: studentClass, medium, stream } = students[0];

  /* ================= SORT BY REG NO ================= */
  const sortedStudents = [...students].sort((a, b) =>
    String(a.registrationNo || "").localeCompare(
      String(b.registrationNo || ""),
      undefined,
      { numeric: true, sensitivity: "base" }
    )
  );

  /* ================= PDF INIT ================= */
  const doc = new jsPDF("p", "mm", "a4");

  let y = 20;

  /* ================= TITLE ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Nashib Ali Academy Student Details", 105, y, {
    align: "center",
  });

  y += 10;

  /* ================= HEADER ================= */
  doc.setFontSize(12);
  doc.text(`Class: ${studentClass}`, 105, y, { align: "center" });
  y += 6;

  doc.text(`Medium: ${capitalizeFirst(medium || "")}`, 105, y, {
    align: "center",
  });
  y += 6;

  if (stream) {
    doc.text(`Stream: ${capitalizeFirst(stream)}`, 105, y, {
      align: "center",
    });
    y += 6;
  }

  y += 6;

  /* ================= TABLE ================= */
  autoTable(doc, {
    startY: y,
    head: [["SL No", "Student Name", "Registration No"]],
    body: sortedStudents.map((s, index) => [
      index + 1,
      capitalizeWords(s.name || ""),
      s.registrationNo || "",
    ]),
    styles: {
      font: "helvetica",
      fontSize: 10,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 90, halign: "left" },
      2: { cellWidth: 60 },
    },
    theme: "grid",
  });

  /* ================= SAVE ================= */
  const className = String(studentClass || "Unknown")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");
  const date = new Date().toISOString().slice(0, 10);

  doc.save(`${capitalizeFirst(medium || "")}_Student_List_Class_${className}_${date}.pdf`);

  toast.success("PDF exported successfully");
};
