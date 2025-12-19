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

    const maxPossible =
      marksArray.length * resultData.maxMarksPerSubject;

    const percentage = (
      (totalMarks / maxPossible) *
      100
    ).toFixed(2);

    /* ========= COLORS ========= */
    const primaryColor = [9, 107, 104];
    const secondaryColor = [18, 153, 144];
    const lightGray = [245, 245, 245];
    const borderColor = [234, 234, 234];

    /* ========= PAGE BACKGROUND ========= */
    doc.setFillColor(...lightGray);
    doc.rect(0, 0, 210, 297, "F");

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.6);
    doc.rect(5, 5, 200, 287, "S");

    /* ========= HEADER ========= */
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, "F");

    try {
      doc.addImage(logoImage, "PNG", 15, 7, 20, 20);
    } catch (e) {}

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Nashib Ali Academy", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      `${capitalizeWords(resultData.examName)} | ${resultData.academicSession}`,
      105,
      25,
      { align: "center" }
    );

    /* ========= STUDENT DETAILS ========= */
    const studentBoxY = 40;
    const studentBoxHeight = 45;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, studentBoxY, 170, studentBoxHeight, 3, 3, "F");
    doc.setDrawColor(...borderColor);
    doc.roundedRect(20, studentBoxY, 170, studentBoxHeight, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text("Student Details", 25, studentBoxY + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);

    const leftX = 25;
    const rightX = 110;

    doc.text("Name:", leftX, studentBoxY + 18);
    doc.text("Reg No:", leftX, studentBoxY + 26);
    doc.text("Rank:", leftX, studentBoxY + 34);

    doc.text("Father's Name:", rightX, studentBoxY + 18);
    doc.text("Mother's Name:", rightX, studentBoxY + 26);
    doc.text("Class:", rightX, studentBoxY + 34);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);

    doc.text(
      capitalizeWords(student.name || "N/A"),
      leftX + 15,
      studentBoxY + 18
    );
    doc.text(
      resultData.registrationNo || "N/A",
      leftX + 15,
      studentBoxY + 26
    );
    doc.text(
      resultData.rank?.toString() || "N/A",
      leftX + 15,
      studentBoxY + 34
    );

    doc.text(
      capitalizeWords(student.fatherName || "N/A"),
      rightX + 28,
      studentBoxY + 18
    );
    doc.text(
      capitalizeWords(student.motherName || "N/A"),
      rightX + 28,
      studentBoxY + 26
    );
    doc.text(
      `${resultData.class} (${student.medium || "N/A"})`,
      rightX + 28,
      studentBoxY + 34
    );

    /* ========= MARKS TABLE ========= */
    autoTable(doc, {
      startY: studentBoxY + studentBoxHeight + 10,
      head: [["SUBJECT", "MAX", "OBTAINED", "GRADE"]],
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
        halign: "center",
      },
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
          const color = getGradeColor(grade);
          const x = data.cell.x + data.cell.width / 2;
          const y = data.cell.y + data.cell.height / 2;

          doc.setFillColor(...color);
          doc.circle(x, y, 3.5, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.text(grade, x, y + 1.2, { align: "center" });
        }
      },
    });

    /* ========= SUMMARY ========= */
    const summaryY = doc.lastAutoTable.finalY + 10;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, summaryY, 170, 25, 2, 2, "F");
    doc.setDrawColor(...borderColor);
    doc.roundedRect(20, summaryY, 170, 25, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);

    doc.text(
      `Total: ${totalMarks}/${maxPossible}   |   Percentage: ${percentage}%`,
      105,
      summaryY + 10,
      { align: "center" }
    );

    doc.text(
      `Result Status: ${
        percentage >= 40 ? "PASS" : "FAIL"
      } (${calculateOverallGrade(percentage)})`,
      105,
      summaryY + 18,
      { align: "center" }
    );

    /* ========= PRINCIPAL SIGNATURE ========= */
    const signY = summaryY + 40;

    doc.setDrawColor(...borderColor);
    doc.line(60, signY, 150, signY);

    try {
      if (principal?.signature) {
        doc.addImage(
          principal.signature,
          "PNG",
          90,
          signY - 18,
          30,
          15
        );
      }
    } catch (e) {}

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(
      capitalizeWords(principal?.name || "Principal"),
      105,
      signY + 6,
      { align: "center" }
    );

    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("PRINCIPAL", 105, signY + 12, { align: "center" });

    /* ========= SAVE ========= */
    doc.save(
      `${capitalizeWords(student.name)}_${resultData.examName}_Result.pdf`
    );
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate result PDF");
  }
};
