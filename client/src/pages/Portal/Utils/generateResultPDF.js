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

// Function to get color based on grade (using ResultDownload.css colors)
const getGradeColor = (grade) => {
  if (grade === "A+" || grade === "A") return [40, 167, 69]; // --success-color: #28a745
  if (grade === "B+" || grade === "B") return [33, 150, 243]; // Blue (default from original)
  if (grade === "C+" || grade === "C") return [255, 152, 0]; // Orange (default from original)
  if (grade === "F") return [220, 53, 69]; // --danger-color: #dc3545
  return [102, 102, 102]; // --text-light: #666666
};

export const generateResultPDF = (resultData) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Color definitions 
    const primaryColor =[9, 107, 104]; 
    const secondaryColor =[18, 153, 144]; 
    const lightGray = [245, 245, 245]; 
    const borderColor = [234, 234, 234]; 

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
      `${capitalizeWords(resultData.result.examName)} ${resultData.result.academicSession || "N/A"}`,
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
    doc.text("Reg No:", leftCol, 72);
    doc.text("Father's Name:", rightCol, 56);
    doc.text("Mother's Name:", rightCol, 64);
    doc.text("Class:", rightCol, 72);
    if (resultData.class && parseInt(resultData.class) > 10 && resultData.stream) {
      doc.text("Stream:", rightCol, 80);
    }

    // Values (bold)
    doc.setFont("helvetica", "bold");
    doc.text(capitalizeWords(resultData.name), leftCol + 15, 56);
    doc.text(resultData.result.rollNo || "N/A", leftCol + 15, 64);
    doc.text(resultData.registrationNo || "N/A", leftCol + 15, 72);
    doc.text(capitalizeWords(resultData.father) || "N/A", rightCol + 25, 56);
    doc.text(capitalizeWords(resultData.mother) || "N/A", rightCol + 25, 64);
    doc.text(resultData.class || "N/A", rightCol + 25, 72);
    if (resultData.class && parseInt(resultData.class) > 10 && resultData.stream) {
      doc.text(resultData.stream, rightCol + 25, 80);
    }

    // --- Marks Table ---
    const marksStartY = 40 + studentDetailsHeight + 5;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Subject-wise Performance", 25, marksStartY);

    const subjects = Object.entries(resultData.result.marks || {});
    autoTable(doc, {
      startY: marksStartY + 5,
      head: [["SUBJECT", "MAX MARKS", "MARKS OBTAINED", "GRADE"]],
      body: subjects.map(([subject, mark]) => {
        const grade = calculateGrade(mark);
        return [subject.toUpperCase(), resultData.result.maxMarksPerSubject, mark, grade];
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

    // --- Summary ---
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
    if (resultData.result.totalMarks !== undefined && resultData.result.maxTotalMarks !== undefined && resultData.result.percentage !== undefined) {
      const summaryText = `Total Marks: ${resultData.result.totalMarks}/${resultData.result.maxTotalMarks}  |  Percentage: ${resultData.result.percentage}%  |  Overall Grade: ${calculateOverallGrade(resultData.result.percentage)}`;
      const resultText = `Result: ${resultData.result.percentage >= 40 ? "PASS" : "FAIL"}`;

      // Top line (Total Marks, Percentage, Grade) - Bold
      doc.setFont("helvetica", "bold");
      doc.text(summaryText, 105, summaryY + 18, { align: "center" });

      // Result below - Bold with conditional color
      doc.setFont("helvetica", "bold");
      const isPassed = resultData.result.percentage >= 40;
      doc.setTextColor(...(isPassed ? [40, 167, 69] : [220, 53, 69])); // successColor or dangerColor
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
    doc.save(`${capitalizeWords(resultData.name)}_Result_Card_${new Date().getFullYear()}.pdf`);
  } catch (error) {
    console.error("Error in PDF generation:", error);
    alert("An error occurred while generating the PDF.");
  }
};