import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import principalSignature from "/principal_sign.png"; 
import examIcSignature from "/exam_ic_sign.png"; 
import logoImage from "/NAA_LOGO.png"; 

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
  return "F (Fail)";
};

const getGradeColor = (grade) => {
  if (grade === "A+" || grade === "A") return [40, 167, 69];
  if (grade === "B+" || grade === "B") return [33, 150, 243];
  if (grade === "C+" || grade === "C") return [255, 152, 0];
  if (grade === "F") return [220, 53, 69];
  return [102, 102, 102];
};

export const generateResultPDF = (resultData) => {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Extracted Data from nested structure
    const student = resultData.studentDetails || {};
    const marksArray = resultData.marks || [];
    const totalMarks = marksArray.reduce((acc, curr) => acc + curr.marksObtained, 0);
    const maxPossible = marksArray.length * resultData.maxMarksPerSubject;
    const percentage = ((totalMarks / maxPossible) * 100).toFixed(2);

    const primaryColor = [9, 107, 104]; 
    const secondaryColor = [18, 153, 144]; 
    const lightGray = [245, 245, 245]; 
    const borderColor = [234, 234, 234]; 

    doc.setFillColor(...lightGray);
    doc.rect(0, 0, 210, 297, "F");
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287, "S");

    // --- Header ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, "F");
    try {
      doc.addImage(logoImage, "PNG", 15, 7, 20, 20);
    } catch (e) {
      doc.setFillColor(255, 255, 255, 0.9);
      doc.circle(25, 17, 10, "F");
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Nashib Ali Academy", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`${capitalizeWords(resultData.examName)} ${resultData.academicSession}`, 105, 25, { align: "center" });

    // --- Student Info Section ---
    const studentDetailsHeight = 45;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 40, 170, studentDetailsHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.roundedRect(20, 40, 170, studentDetailsHeight, 3, 3, "S");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.text("Student Details", 25, 48);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    
    const leftCol = 25;
    const rightCol = 110;

    doc.text("Name:", leftCol, 56);
    doc.text("Reg No:", leftCol, 64);
    doc.text("Rank:", leftCol, 72);

    doc.text("Father's Name:", rightCol, 56);
    doc.text("Mother's Name:", rightCol, 64);
    doc.text("Class:", rightCol, 72);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(capitalizeWords(student.name || "N/A"), leftCol + 15, 56);
    doc.text(resultData.registrationNo, leftCol + 15, 64);
    doc.text(resultData.rank?.toString() || "N/A", leftCol + 15, 72);

    doc.text(capitalizeWords(student.fatherName || "N/A"), rightCol + 28, 56);
    doc.text(capitalizeWords(student.motherName || "N/A"), rightCol + 28, 64);
    doc.text(`${resultData.class} (${student.medium || "N/A"})`, rightCol + 28, 72);

    // --- Table ---
    const marksStartY = 40 + studentDetailsHeight + 10;
    autoTable(doc, {
      startY: marksStartY,
      head: [["SUBJECT", "MAX MARKS", "OBTAINED", "GRADE"]],
      body: marksArray.map((m) => {
        const grade = calculateGrade(m.marksObtained);
        return [m.subject.toUpperCase(), resultData.maxMarksPerSubject, m.marksObtained, grade];
      }),
      headStyles: { fillColor: primaryColor, halign: "center" },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
      },
      margin: { left: 20, right: 20 },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.section === "body") {
          const grade = data.cell.raw;
          const gradeColor = getGradeColor(grade);
          const circleX = data.cell.x + data.cell.width / 2;
          const circleY = data.cell.y + data.cell.height / 2;
          doc.setFillColor(...gradeColor);
          doc.circle(circleX, circleY, 3.5, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.text(grade, circleX, circleY + 1.2, { align: "center" });
        }
      },
    });

    // --- Final Summary ---
    const summaryY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, summaryY, 170, 25, 2, 2, "F");
    doc.setDrawColor(...borderColor);
    doc.roundedRect(20, summaryY, 170, 25, 2, 2, "S");

    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${totalMarks}/${maxPossible}  |  Percentage: ${percentage}%`, 105, summaryY + 10, { align: "center" });
    
    const overallGrade = calculateOverallGrade(percentage);
    doc.text(`Result Status: ${percentage >= 40 ? "PASS" : "FAIL"} (${overallGrade})`, 105, summaryY + 18, { align: "center" });

    // --- Signatures ---
    const sigY = summaryY + 40;
    doc.setDrawColor(...borderColor);
    doc.line(30, sigY, 180, sigY);
    
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    try {
        doc.addImage(examIcSignature, "PNG", 40, sigY - 18, 30, 15);
        doc.addImage(principalSignature, "PNG", 140, sigY - 18, 30, 15);
    } catch(e) {}

    doc.text("EXAM IN-CHARGE", 55, sigY + 5, { align: "center" });
    doc.text("PRINCIPAL", 155, sigY + 5, { align: "center" });

    doc.save(`${capitalizeWords(student.name)}_Result_${resultData.examName}.pdf`);
  } catch (error) {
    console.error("PDF Error:", error);
    alert("An error occurred during PDF generation.");
  }
};