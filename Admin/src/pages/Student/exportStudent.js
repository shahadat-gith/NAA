import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { capitalizeWords } from "../../utils/utility";
import logo from "/logo.png";

/**
 * Export the provided list of students to a PDF file.
 *
 * @param {Object[]} filteredStudents
 * @param {string} classFilter
 * @param {string} mediumFilter
 * @param {string} streamFilter
 */
export function exportStudentListPDF(
  filteredStudents,
  classFilter,
  mediumFilter,
  streamFilter = ""
) {
  if (!Array.isArray(filteredStudents) || filteredStudents.length === 0) {
    console.warn("No students available for export.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();


  // ===== Group Students By Class =====
  const groups = filteredStudents.reduce((acc, stu) => {
    const cls = stu.class || "Unknown";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(stu);
    return acc;
  }, {});

  const mediumText = mediumFilter
    ? capitalizeWords(mediumFilter)
    : "All Mediums";

  const streamText = streamFilter
    ? capitalizeWords(streamFilter)
    : null;

  const classKeys = Object.keys(groups);

  classKeys.forEach((cls, grpIndex) => {
    const studentsInClass = groups[cls];

    if (grpIndex > 0) {
      doc.addPage();
    }

    // ================= HEADER =================
    let lineY = 20;

    const logoWidth = 18;
    const logoHeight = 18;
    const logoY = 12;

    // Left Logo
    doc.addImage(logo, "PNG", 14, logoY, logoWidth, logoHeight);

    // Right Logo
    doc.addImage(
      logo,
      "PNG",
      pageWidth - 14 - logoWidth,
      logoY,
      logoWidth,
      logoHeight
    );

    // Academy Name (perfectly centered)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Nashib Ali Academy", pageWidth / 2, 20, {
      align: "center",
    });

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);

    lineY = 40;

    // ================= FILTER DETAILS =================
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const displayClsText = cls
      ? cls
      : "All Classes";

    doc.text(`Class: ${displayClsText}`, 14, lineY);
    lineY += 6;

    doc.text(`Medium: ${mediumText}`, 14, lineY);
    lineY += 6;

    if (streamText) {
      doc.text(`Stream: ${streamText}`, 14, lineY);
      lineY += 6;
    }

    lineY += 4;
    doc.text(
      `Total Students: ${studentsInClass.length}`,
      14,
      lineY
    );

    // ================= TABLE TITLE =================
    lineY += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Student List", 14, lineY);

    // ================= TABLE DATA =================
    const body = studentsInClass.map((student, idx) => [
      idx + 1,
      capitalizeWords(student?.name) || "-",
      student?.registrationNo ?? "-",
    ]);

    autoTable(doc, {
      startY: lineY + 6,
      head: [["Sl. No", "Student Name", "Registration No"]],
      body,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });
  });

  // ================= FILE NAME =================
  const baseClsText = classFilter
    ? classFilter
    : "all_classes";

  const fileName = `student_list_${baseClsText}_${mediumText}.pdf`
    .replace(/\s+/g, "_")
    .toLowerCase();

  doc.save(fileName);
}