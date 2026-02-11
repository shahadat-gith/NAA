import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "/NAA_LOGO.png";

/* ================= UTILITIES ================= */

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const calculateGrade = (marks) => {
  const marksNum = parseInt(marks);
  if (isNaN(marksNum)) return "NA";
  if (marksNum >= 90) return "A+";
  if (marksNum >= 80) return "A";
  if (marksNum >= 70) return "B+";
  if (marksNum >= 60) return "B";
  if (marksNum >= 50) return "C+";
  if (marksNum >= 40) return "C";
  return "F";
};

const calculateOverallGrade = (percentage) => {
  const percentNum = parseFloat(percentage);
  if (isNaN(percentNum)) return "N/A";
  if (percentNum >= 90) return "A+ (Outstanding)";
  if (percentNum >= 80) return "A (Excellent)";
  if (percentNum >= 70) return "B+ (Very Good)";
  if (percentNum >= 60) return "B (Good)";
  if (percentNum >= 50) return "C+ (Above Average)";
  if (percentNum >= 40) return "C (Average)";
  if (percentNum >= 33) return "D (Below Average)";
  return "F (Fail)";
};

const getGradeColor = (grade) => {
  if (grade === "A+" || grade === "A") return [40, 167, 69]; // Green
  if (grade === "B+" || grade === "B") return [33, 150, 243]; // Blue
  if (grade === "C+" || grade === "C") return [255, 152, 0]; // Orange
  if (grade === "F") return [220, 53, 69]; // Red
  return [102, 102, 102];
};





/* ================= MAIN PDF FUNCTION ================= */

export const generateResultPDF = (resultData, principal) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ========= DATA EXTRACTION & THEME ========= */
    const student = resultData.studentDetails || {};
    const marksArray = resultData.marks || [];
    const totalMarks = resultData.totalMarks || 0;
    const percentage = resultData.percentage?.toFixed(2) || "0.00";
    const isPassed = resultData.resultStatus === "PASS";
    const maxPossible = marksArray.length * (resultData.maxMarksPerSubject || 100);
    const showStream = resultData.class === "11" || resultData.class === "12";

    const primaryColor = [9, 107, 104];
    const accentColor = [18, 153, 144];
    const darkText = [33, 37, 41];
    const lightBg = [248, 249, 250];
    const cardBg = [255, 255, 255];
    const borderColor = [210, 210, 210]; // New border color

    /* ========= PAGE SETUP ========= */
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 3, 297, "F");

    /* ========= HEADER ========= */
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, "F");

    try {
      doc.addImage(logoImage, "PNG", 15, 10, 25, 25);
    } catch (e) {}

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Nashib Ali Academy", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Academic Excellence Report", 105, 27, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(`${capitalizeWords(resultData.examName)} • ${resultData.academicSession}`, 105, 36, { align: "center" });

    /* ========= STUDENT INFO CARD ========= */
    const cardY = 55;
    doc.setFillColor(...cardBg);
    doc.roundedRect(15, cardY, 180, 45, 4, 4, "F");
    doc.setFillColor(...accentColor);
    doc.roundedRect(15, cardY, 180, 9, 4, 4, "F");
    doc.rect(15, cardY + 5, 180, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("STUDENT INFORMATION", 105, cardY + 6, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Student Name", 25, cardY + 18);
    doc.text("Registration No", 25, cardY + 28);
    doc.text("Class", 25, cardY + 38);
    doc.text("Father's Name", 110, cardY + 18);
    doc.text("Mother's Name", 110, cardY + 28);
    if (showStream) doc.text("Stream", 110, cardY + 38);

    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(capitalizeWords(student.name || "N/A"), 25, cardY + 23);
    doc.text(resultData.registrationNo || "N/A", 25, cardY + 33);
    doc.text(resultData.class || "N/A", 25, cardY + 43);
    doc.text(capitalizeWords(student.fatherName || "N/A"), 110, cardY + 23);
    doc.text(capitalizeWords(student.motherName || "N/A"), 110, cardY + 33);
    if (showStream) doc.text(capitalizeWords(resultData.stream || "N/A"), 110, cardY + 43);

    /* ========= MARKS TABLE (WITH TABULAR BORDERS) ========= */
    autoTable(doc, {
      startY: cardY + 55,
      margin: { left: 15, right: 15, bottom: 70 },
      theme: 'grid', // Enables formal borders
      head: [["SUBJECT", "MAX MARKS", "OBTAINED", "GRADE"]],
      body: marksArray.map((m) => [
        capitalizeWords(m.subject),
        resultData.maxMarksPerSubject,
        m.mark,
        calculateGrade(m.mark),
      ]),
      headStyles: { 
        fillColor: primaryColor, 
        textColor: [255, 255, 255],
        halign: "center",
        valign: "middle",
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: primaryColor
      },
      bodyStyles: { 
        textColor: darkText,
        fontSize: 9,
        cellPadding: 4,
        lineWidth: 0.1,
        lineColor: borderColor,
        valign: "middle"
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252] // Subtle zebra striping
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'left' },
        1: { halign: "center", cellWidth: 35 },
        2: { halign: "center", cellWidth: 35, fontStyle: "bold" },
        3: { halign: "center", cellWidth: 40 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.section === "body") {
          const grade = data.cell.raw;
          const color = getGradeColor(grade);
          const centerX = data.cell.x + data.cell.width / 2;
          const centerY = data.cell.y + data.cell.height / 2;

          // Circular Badge
          doc.setFillColor(...color);
          doc.circle(centerX, centerY, 3.2, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(grade, centerX, centerY + 0.8, { align: "center" });
        }
      },
    });

    /* ========= BOTTOM COMPONENTS (PINNED) ========= */
    const summaryY = 240; 
    const summaryCardHeight = 42;

    // Summary Card
    doc.setFillColor(...cardBg);
    doc.roundedRect(15, summaryY, 125, summaryCardHeight, 4, 4, "F");
    doc.setFillColor(...accentColor);
    doc.roundedRect(15, summaryY, 125, 9, 4, 4, "F");
    doc.rect(15, summaryY + 5, 125, 4, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("RESULT SUMMARY", 77.5, summaryY + 6, { align: "center" });

    // Summary Rows
    const summaryRows = [
      { label: "Total Marks:", value: `${totalMarks} / ${maxPossible}` },
      { label: "Percentage:", value: `${percentage}%`, color: accentColor },
      { label: "Overall Grade:", value: calculateOverallGrade(percentage) },
      { label: "Rank:", value: resultData.rank?.toString() || "N/A", color: accentColor },
      { label: "Result:", value: resultData.resultStatus, color: isPassed ? [40, 167, 69] : [220, 53, 69] }
    ];

    let rowY = summaryY + 15;
    summaryRows.forEach((row) => {
      doc.setTextColor(...darkText);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(row.label, 25, rowY);
      
      if (row.color) doc.setTextColor(...row.color);
      doc.text(row.value, 60, rowY);
      rowY += 6;
    });

    // Principal Card
    const signX = 145;
    doc.setFillColor(...cardBg);
    doc.roundedRect(signX, summaryY, 50, summaryCardHeight, 4, 4, "F");

    try {
      if (principal?.signature?.url) {
        doc.addImage(principal.signature.url, "PNG", signX + 7.5, summaryY + 4, 35, 12);
      }
    } catch (e) {}

    doc.setDrawColor(220, 220, 220);
    doc.line(signX + 8, summaryY + 28, signX + 42, summaryY + 28);
    doc.setFontSize(8);
    doc.setTextColor(...darkText);
    doc.text(capitalizeWords(principal?.name || "Principal"), signX + 25, summaryY + 33, { align: "center" });
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("(Principal - NAA)", signX + 25, summaryY + 37, { align: "center" });

    /* ========= FOOTER ========= */
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(`* This is an electronically generated report. Date: ${new Date().toLocaleDateString()}`, 105, 288, { align: "center" });

    doc.save(`${capitalizeWords(student.name || "Student")}_Result.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Error:", error);
    return false;
  }
};