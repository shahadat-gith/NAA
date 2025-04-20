import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import principalSignature from "/principal_sign.png"; // Adjust path
import examIcSignature from "/exam_ic_sign.png"; // Adjust path
import logoImage from "/logo.png"; // Add a school logo

// Helper function to capitalize words
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to calculate grade based on marks
export const calculateGrade = (marks) => {
  try {
    const marksNum = parseInt(marks);
    if (isNaN(marksNum)) return "NA";
    if (marksNum >= 90) return "A+";
    if (marksNum >= 80) return "A";
    if (marksNum >= 70) return "B+";
    if (marksNum >= 60) return "B";
    if (marksNum >= 50) return "C+";
    if (marksNum >= 40) return "C";
    return "F";
  } catch (e) {
    console.error("Error calculating grade:", e);
    return "ERROR";
  }
};

// Helper function to calculate overall grade
const calculateOverallGrade = (percentage) => {
  try {
    const percentNum = parseFloat(percentage);
    if (isNaN(percentNum)) return "N/A";
    if (percentNum >= 90) return "A+ (Outstanding)";
    if (percentNum >= 80) return "A (Excellent)";
    if (percentNum >= 70) return "B+ (Very Good)";
    if (percentNum >= 60) return "B (Good)";
    if (percentNum >= 50) return "C+ (Above Average)";
    if (percentNum >= 40) return "C (Average)";
    return "F (Fail)";
  } catch (e) {
    console.error("Error calculating overall grade:", e);
    return "ERROR";
  }
};

// Function to get color based on grade
const getGradeColor = (grade) => {
  if (grade === "A+" || grade === "A") return [76, 175, 80]; // Green
  if (grade === "B+" || grade === "B") return [33, 150, 243]; // Blue
  if (grade === "C+" || grade === "C") return [255, 152, 0]; // Orange
  if (grade === "F") return [244, 67, 54]; // Red
  return [97, 97, 97]; // Default gray
};

export const generateResultPDF = (resultData) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const { firstName, lastName, rollNo, registrationNo, class: className, medium, stream, result } = resultData;
    const {
      marks,
      totalMarks,
      maxTotalMarks,
      percentage,
      maxMarksPerSubject,
      examName,
      academicSession,
    } = result;

    // Combine firstName and lastName into full name
    const fullName = `${capitalizeWords(firstName)} ${capitalizeWords(lastName || "")}`.trim();

    // Define colors
    const primaryColor = [25, 118, 210]; // Material Blue 700
    const secondaryColor = [33, 33, 33]; // Dark Gray for text
    const lightGray = [245, 245, 245]; // Light Gray background
    const borderColor = [224, 224, 224]; // Light Gray border

    // Document background
    doc.setFillColor(...lightGray);
    doc.rect(0, 0, 210, 297, "F");

    // --- Page Border ---
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287, "S");

    // --- Header ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, "F");

    // Add logo
    try {
      doc.addImage(logoImage, "PNG", 15, 7, 20, 20);
    } catch (e) {
      doc.setFillColor(255, 255, 255, 0.9);
      doc.circle(25, 17, 10, "F");
      doc.setTextColor(...primaryColor);
      doc.setFontSize(12);
      doc.text("NAA", 25, 20, { align: "center" });
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Nashib Ali Academy", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(
      `${capitalizeWords(examName)} ${academicSession || "N/A"}`,
      105,
      25,
      { align: "center" }
    );
    doc.setFontSize(10);
    doc.text("Report Card", 105, 32, { align: "center" });

    // --- Student Details (Fixed Height) ---
    const studentDetailsHeight = 45;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 40, 170, studentDetailsHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 40, 170, studentDetailsHeight, 3, 3, "S");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Student Details", 25, 48);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    const leftCol = 25;
    const rightCol = 105;

    // Labels (normal)
    doc.text("Name:", leftCol, 56);
    doc.text("Roll No:", leftCol, 64);
    doc.text("Reg No:", leftCol, 72); // Changed from "DOB" to "Reg No"
    doc.text("Class:", rightCol, 56);
    doc.text("Medium:", rightCol, 64);
    if (className && parseInt(className) > 10 && stream) {
      doc.text("Stream:", rightCol, 72);
    }

    // Values (bold)
    doc.setFont("helvetica", "bold");
    doc.text(fullName, leftCol + 15, 56);
    doc.text(rollNo || "N/A", leftCol + 15, 64);
    doc.text(registrationNo || "N/A", leftCol + 15, 72); // Use registrationNo instead of dob
    doc.text(className || "N/A", rightCol + 15, 56);
    doc.text(medium || "N/A", rightCol + 15, 64);
    if (className && parseInt(className) > 10 && stream) {
      doc.text(stream, rightCol + 15, 72);
    }

    // --- Marks Table ---
    const marksStartY = 40 + studentDetailsHeight + 5;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Subject-wise Performance", 25, marksStartY);

    const subjects = Object.entries(marks || {});
    autoTable(doc, {
      startY: marksStartY + 5,
      head: [["SUBJECT", "MAX MARKS", "MARKS OBTAINED", "GRADE"]],
      body: subjects.map(([subject, mark]) => {
        const grade = calculateGrade(mark);
        return [subject.toUpperCase(), maxMarksPerSubject, mark, grade];
      }),
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: borderColor,
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: "auto" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center", cellWidth: 20 },
      },
      margin: { left: 20, right: 20 },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.section === "body") {
          const grade = data.cell.raw;
          const gradeColor = getGradeColor(grade);
          const circleX = data.cell.x + data.cell.width / 2;
          const circleY = data.cell.y + data.cell.height / 2;
          doc.setFillColor(...gradeColor);
          doc.circle(circleX, circleY, 4, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text(grade, circleX, circleY + 1.5, { align: "center" });
        }
      },
    });

    // --- Summary (Redesigned Layout) ---
    const summaryY = doc.lastAutoTable.finalY + 10;
    const summaryHeight = 30;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, summaryY, 170, summaryHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, summaryY, 170, summaryHeight, 3, 3, "S");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Final Result", 25, summaryY + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    if (totalMarks !== undefined && maxTotalMarks !== undefined && percentage !== undefined) {
      const summaryText = `Total Marks: ${totalMarks}/${maxTotalMarks}  |  Percentage: ${percentage}%  |  Overall Grade: ${calculateOverallGrade(percentage)}`;
      const resultText = `Result: ${percentage >= 40 ? "PASS" : "FAIL"}`;

      // Top line (Total Marks, Percentage, Grade) - Bold
      doc.setFont("helvetica", "bold");
      doc.text(summaryText, 105, summaryY + 18, { align: "center" });

      // Result below - Bold with conditional color
      doc.setFont("helvetica", "bold");
      const isPassed = percentage >= 40;
      doc.setTextColor(...(isPassed ? [76, 175, 80] : [244, 67, 54]));
      doc.text(resultText, 105, summaryY + 24, { align: "center" });
    }

    // --- Signatures ---
    const signatureY = summaryY + summaryHeight + 10;
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(30, signatureY, 180, signatureY);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("AUTHORIZED SIGNATURES", 105, signatureY + 8, { align: "center" });

    const examIcX = 55;
    const principalX = 155;
    const signatureLineY = signatureY + 25;

    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    if (examIcSignature) {
      try {
        doc.addImage(examIcSignature, "PNG", examIcX - 15, signatureY + 12, 30, 15);
      } catch (e) {
        doc.setDrawColor(...secondaryColor);
        doc.line(examIcX - 15, signatureLineY, examIcX + 15, signatureLineY);
      }
    }
    doc.text("(Jahangir Hussain)", examIcX, signatureLineY + 6, { align: "center" });
    doc.setFontSize(7);
    doc.setTextColor(...primaryColor);
    doc.text("EXAM IN-CHARGE", examIcX, signatureLineY + 12, { align: "center" });

    if (principalSignature) {
      try {
        doc.addImage(principalSignature, "PNG", principalX - 15, signatureY + 12, 30, 15);
      } catch (e) {
        doc.setDrawColor(...secondaryColor);
        doc.line(principalX - 15, signatureLineY, principalX + 15, signatureLineY);
      }
    }
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("(Abul Mojid Ali)", principalX, signatureLineY + 6, { align: "center" });
    doc.setFontSize(7);
    doc.setTextColor(...primaryColor);
    doc.text("PRINCIPAL", principalX, signatureLineY + 12, { align: "center" });

    // --- Generation Date ---
    const dateY = signatureY + 45;
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...secondaryColor);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, dateY, { align: "center" });

    // Save the PDF
    doc.save(`${fullName}_Result_Card_${new Date().getFullYear()}.pdf`);
  } catch (error) {
    console.error("Error in PDF generation:", error);
    alert("An error occurred while generating the PDF.");
  }
};