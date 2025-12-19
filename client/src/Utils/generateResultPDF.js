import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "/NAA_LOGO.png";

/* ================= UTILITIES ================= */

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
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
  return "F (Fail)";
};

const getGradeColor = (grade) => {
  if (grade === "A+" || grade === "A") return [40, 167, 69];
  if (grade === "B+" || grade === "B") return [33, 150, 243];
  if (grade === "C+" || grade === "C") return [255, 152, 0];
  if (grade === "F") return [220, 53, 69];
  return [102, 102, 102];
};

/* ================= MAIN PDF FUNCTION ================= */

export const generateResultPDF = (resultData, principal) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ========= DATA ========= */
    const student = resultData.studentDetails || {};
    const marksArray = resultData.marks || [];

    const totalMarks = marksArray.reduce(
      (acc, curr) => acc + curr.marksObtained,
      0
    );

    const maxPossible = marksArray.length * resultData.maxMarksPerSubject;
    const percentage = ((totalMarks / maxPossible) * 100).toFixed(2);
    const isPassed = percentage >= 40;

    /* ========= COLORS ========= */
    const primaryColor = [9, 107, 104];
    const accentColor = [18, 153, 144];
    const darkText = [33, 37, 41];
    const lightBg = [248, 249, 250];
    const cardBg = [255, 255, 255];

    /* ========= PAGE SETUP ========= */
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 210, 297, "F");

    // Decorative side accent
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 3, 297, "F");

    /* ========= HEADER WITH GRADIENT EFFECT ========= */
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, "F");
    
    // Add subtle overlay
    doc.setFillColor(255, 255, 255);
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.circle(190, 10, 40, "F");
    doc.circle(20, 40, 30, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Logo
    try {
      doc.addImage(logoImage, "PNG", 15, 10, 25, 25);
    } catch (e) {}

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Nashib Ali Academy", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Academic Excellence Report", 105, 28, { align: "center" });

    // Exam info badge
    doc.setFillColor(255, 255, 255);
    doc.setGState(new doc.GState({ opacity: 0.15 }));
    doc.roundedRect(65, 33, 80, 8, 2, 2, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `${capitalizeWords(resultData.examName)} • ${resultData.academicSession}`,
      105,
      38,
      { align: "center" }
    );

    /* ========= STUDENT INFO CARD ========= */
    const cardY = 55;
    
    doc.setFillColor(...cardBg);
    doc.roundedRect(15, cardY, 180, 50, 4, 4, "F");
    
    // Card shadow effect
    doc.setDrawColor(0, 0, 0);
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.roundedRect(15.5, cardY + 0.5, 180, 50, 4, 4, "S");
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Title bar
    doc.setFillColor(...accentColor);
    doc.roundedRect(15, cardY, 180, 10, 4, 4, "F");
    doc.rect(15, cardY + 6, 180, 4, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("STUDENT INFORMATION", 105, cardY + 7, { align: "center" });

    // Student details in two columns
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);

    const leftCol = 25;
    const rightCol = 110;
    const row1 = cardY + 20;
    const row2 = cardY + 30;
    const row3 = cardY + 40;

    // Left column labels
    doc.text("Student Name", leftCol, row1);
    doc.text("Registration No", leftCol, row2);
    doc.text("Class Rank", leftCol, row3);

    // Left column values
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.setFontSize(10);
    doc.text(capitalizeWords(student.name || "N/A"), leftCol, row1 + 5);
    doc.text(resultData.registrationNo || "N/A", leftCol, row2 + 5);
    doc.text(resultData.rank?.toString() || "N/A", leftCol, row3 + 5);

    // Right column labels
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Father's Name", rightCol, row1);
    doc.text("Mother's Name", rightCol, row2);
    doc.text("Class & Medium", rightCol, row3);

    // Right column values
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.setFontSize(10);
    doc.text(capitalizeWords(student.fatherName || "N/A"), rightCol, row1 + 5);
    doc.text(capitalizeWords(student.motherName || "N/A"), rightCol, row2 + 5);
    doc.text(`${resultData.class} (${student.medium || "N/A"})`, rightCol, row3 + 5);

    /* ========= MARKS TABLE ========= */
    autoTable(doc, {
      startY: cardY + 60,
      head: [["SUBJECT", "MAX MARKS", "OBTAINED", "GRADE"]],
      body: marksArray.map((m) => {
        const grade = calculateGrade(m.marksObtained);
        return [
          m.subject.toUpperCase(),
          resultData.maxMarksPerSubject,
          m.marksObtained,
          grade,
        ];
      }),
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 5,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70, halign: "left" },
        1: { halign: "center", cellWidth: 35 },
        2: { halign: "center", cellWidth: 35, fontStyle: "bold" },
        3: { halign: "center", cellWidth: 40 },
      },
      margin: { left: 15, right: 15 },
      didDrawCell: (data) => {
        // Add rounded corners to header
        if (data.cell.section === "head") {
          const { x, y, width, height } = data.cell;
          doc.setFillColor(...primaryColor);
          
          // First column - rounded left corners
          if (data.column.index === 0) {
            doc.roundedRect(x, y, width, height, 3, 3, "F");
            doc.rect(x + 3, y, width - 3, height, "F");
          }
          // Last column - rounded right corners
          else if (data.column.index === 3) {
            doc.roundedRect(x, y, width, height, 3, 3, "F");
            doc.rect(x, y, width - 3, height, "F");
          }
          // Middle columns - no rounding
          else {
            doc.rect(x, y, width, height, "F");
          }
          
          // Redraw text on top
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const align = data.column.index === 0 ? "left" : "center";
          const textX = data.column.index === 0 ? x + 5 : x + width / 2;
          doc.text(data.cell.raw, textX, y + height / 2 + 1.5, { align });
        }
        
        // Grade badges for body cells
        if (data.column.index === 3 && data.cell.section === "body") {
          const grade = data.cell.raw;
          const color = getGradeColor(grade);
          const x = data.cell.x + data.cell.width / 2;
          const y = data.cell.y + data.cell.height / 2;

          doc.setFillColor(...color);
          doc.roundedRect(x - 8, y - 4, 16, 8, 2, 2, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text(grade, x, y + 1.5, { align: "center" });
        }
      },
    });

    /* ========= RESULT SUMMARY & SIGNATURE (ABOVE FOOTER) ========= */
    const summaryY = 260; // Fixed position above footer

    // Left side: Marks summary (simple, no borders)
    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Marks:", 20, summaryY);
    doc.text(`${totalMarks} / ${maxPossible}`, 55, summaryY);

    doc.text("Percentage:", 20, summaryY + 8);
    doc.setTextColor(...accentColor);
    doc.setFontSize(13);
    doc.text(`${percentage}%`, 55, summaryY + 8);

    // Result status (below percentage, simple text)
    const statusColor = isPassed ? [40, 167, 69] : [220, 53, 69];
    doc.setTextColor(...statusColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `${isPassed ? "PASS" : "FAIL"} - ${calculateOverallGrade(percentage)}`,
      20,
      summaryY + 18
    );

    /* ========= RIGHT SIDE: PRINCIPAL SIGNATURE (simple, no borders) ========= */
    const signX = 150;

    // Signature image
    try {
      if (principal?.signature?.url) {
        doc.addImage(
          principal.signature.url,
          "PNG",
          signX,
          summaryY - 5,
          40,
          15
        );
      }
    } catch (e) {}

    // Signature line
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(signX, summaryY + 13, signX + 40, summaryY + 13);

    // Principal name and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text(
      capitalizeWords(principal?.name || "Principal"),
      signX + 20,
      summaryY + 18,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("Principal", signX + 20, summaryY + 22, { align: "center" });

    /* ========= FOOTER ========= */
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      15,
      290,
      { align: "left" }
    );

    /* ========= SAVE ========= */
    doc.save(
      `${capitalizeWords(student.name)}_${resultData.examName}_Result.pdf`
    );
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate result PDF");
  }
};