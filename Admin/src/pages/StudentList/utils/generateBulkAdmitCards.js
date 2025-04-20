import { jsPDF } from "jspdf";

// Helper function to capitalize words
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const generateBulkAdmitCards = (students, admitCardConfig) => {
  if (!students || students.length === 0) {
    throw new Error("No students provided for admit card generation");
  }
  if (!admitCardConfig) {
    throw new Error("Admit card configuration is required");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  students.forEach((student, index) => {
    if (index > 0) {
      doc.addPage();
    }

    const primaryColor = [0, 51, 102];
    const backgroundColor = [245, 245, 245];

    // Background and border
    doc.setFillColor(...backgroundColor);
    doc.rect(10, 10, 190, 277, "F");

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(10, 10, 190, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NASHIB ALI ACADEMY", 105, 25, { align: "center" });

    // Admit Card Title
    doc.setFillColor(220, 220, 220);
    doc.rect(60, 40, 90, 10, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ADMIT CARD", 105, 47, { align: "center" });

    // Student Information Section (extended to fit more fields)
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 55, 180, 80, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT INFORMATION", 20, 62);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 64, 140, 64);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const leftCol = 20;
    const rightCol = 80;
    let yPos = 72;
    const lineHeight = 7;

    const fullName = `${capitalizeWords(student.firstName)} ${capitalizeWords(student.lastName || "")}`.trim();

    doc.setFont("helvetica", "bold");
    doc.text("Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(fullName, rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Class:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.class) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Medium:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.medium) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    if (student.stream) {
      doc.setFont("helvetica", "bold");
      doc.text("Stream:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(capitalizeWords(student.stream), rightCol, yPos);
      yPos += lineHeight;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Father's Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.fatherName) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Mother's Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.motherName) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    // Examination Details Section
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 140, 180, 60, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EXAMINATION DETAILS", 20, 147);

    doc.setDrawColor(...primaryColor);
    doc.line(20, 149, 140, 149);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    yPos = 157;
    doc.setFont("helvetica", "bold");
    doc.text("Exam:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(admitCardConfig.examName) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Date:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      admitCardConfig.examDate ? new Date(admitCardConfig.examDate).toLocaleDateString("en-IN") : "N/A",
      rightCol,
      yPos
    );
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Center:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(admitCardConfig.examCenter || "N/A", rightCol, yPos);

    // Signatures
    yPos = 210;
    try {
      doc.addImage("/principal_sign.png", "PNG", 20, yPos, 60, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Principal's Signature", 50, yPos + 25, { align: "center" });

      doc.addImage("/exam_ic_sign.png", "PNG", 120, yPos, 60, 20);
      doc.setFontSize(10);
      doc.text("Academic In-Charge Signature", 150, yPos + 25, { align: "center" });
    } catch (error) {
      console.error("Error adding signatures to PDF:", error);
      doc.setFontSize(10);
      doc.text("Signature Error", 105, yPos + 10, { align: "center" });
    }

    // Footer
    doc.setFillColor(...primaryColor);
    doc.rect(10, 270, 190, 17, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("NASHIB ALI ACADEMY", 105, 278, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")} | 123 Education Street, Knowledge City - 100001 | Phone: +91 9876543210`,
      105,
      284,
      { align: "center" }
    );
  });

  // Generate a descriptive filename
  const className = capitalizeWords(students[0].class);
  const medium = capitalizeWords(students[0].medium);
  const stream = students[0].stream ? `_${capitalizeWords(students[0].stream)}` : "";
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`${className}_${medium}${stream}_Admit_Cards_${date}.pdf`);
};

export default generateBulkAdmitCards;