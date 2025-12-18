import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png";
import examIcSignature from "/exam_ic_sign.png"; 

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

  // Refined minimal color scheme
  const primaryColor = [34, 47, 62]; // Deep charcoal
  const accentColor = [78, 100, 123]; // Slate blue
  const textColor = [75, 75, 75]; // Medium gray
  const backgroundColor = [255, 255, 255]; // Pure white
  const dividerColor = [220, 220, 220]; // Light gray for dividers
  const sectionBg = [248, 248, 248]; // Very light gray for subtle backgrounds

  students.forEach((student, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Page setup
    doc.setFillColor(...backgroundColor);
    doc.rect(0, 0, 210, 297, "F");

    // Simple header with no corner structures
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("NASHIB ALI ACADEMY", 105, 13, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("ADMIT CARD", 105, 23, { align: "center" });

    // Subtle horizontal divider below header
    doc.setDrawColor(...dividerColor);
    doc.setLineWidth(0.5);
    doc.line(15, 38, 195, 38);

    // Student Information Section
    let yPos = 50;

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT INFORMATION", 20, yPos);

    // Subtle divider
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.75);
    doc.line(20, yPos + 4, 100, yPos + 4);

    // Function to add two-column layout fields
    const addTwoColumnField = (label1, value1, label2, value2, y) => {
      // Column 1
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.text(label1, 25, y);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...primaryColor);
      doc.text(value1 || "N/A", 25, y + 6);

      // Column 2
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.text(label2, 115, y);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...primaryColor);
      doc.text(value2 || "N/A", 115, y + 6);

      return y + 16;
    };

    // Information grid
    yPos += 15;
    yPos = addTwoColumnField("NAME", capitalizeWords(student.name), "REGISTRATION NO", student.registrationNo, yPos);
    yPos = addTwoColumnField("CLASS", capitalizeWords(student.class), "ROLL NO", student.results?.rollNo, yPos);
    yPos = addTwoColumnField("MEDIUM", capitalizeWords(student.medium), 
                            "STREAM", student.stream ? capitalizeWords(student.stream) : "N/A", yPos);
    yPos = addTwoColumnField("FATHER'S NAME", capitalizeWords(student.father), "MOTHER'S NAME", capitalizeWords(student.mother), yPos);

    // Examination details section
    yPos += 10;
    const examSectionTop = yPos;

    // Clean left-aligned heading with subtle indicator
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(3);
    doc.line(15, examSectionTop, 15, examSectionTop + 16);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EXAMINATION DETAILS", 20, examSectionTop + 5);

    // Light gray background for exam info
    doc.setFillColor(...sectionBg);
    doc.roundedRect(15, examSectionTop + 10, 180, 25, 1, 1, "F");

    // Three-column exam details
    const col1 = 25;
    const col2 = 90;
    const col3 = 155;
    const detailsY = examSectionTop + 20;

    // Exam name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...textColor);
    doc.text("EXAM", col1, detailsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(capitalizeWords(admitCardConfig.examName) || "N/A", col1, detailsY + 6);

    // Exam date
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text("DATE", col2, detailsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(
      admitCardConfig.examDate ? new Date(admitCardConfig.examDate).toLocaleDateString("en-IN") : "N/A",
      col2,
      detailsY + 6
    );

    // Exam center
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text("CENTER", col3, detailsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(capitalizeWords(admitCardConfig.examCenter) || "N/A", col3 - 15, detailsY + 6);

    // Instructions section
    yPos = examSectionTop + 45;

    // Left-aligned heading with subtle indicator
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(3);
    doc.line(15, yPos, 15, yPos + 16);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIONS", 20, yPos + 5);

    // Light gray background for instructions
    doc.setFillColor(...sectionBg);
    doc.roundedRect(15, yPos + 10, 180, 30, 1, 1, "F");

    // Instructions in clean layout
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const instructions = [
      "Please bring this admit card along with a valid photo ID to the examination center.",
      "Mobile phones and electronic devices are strictly prohibited in the examination hall.",
      "Candidates should arrive at the center at least 30 minutes before the examination time."
    ];

    yPos += 20;
    instructions.forEach((instruction, index) => {
      doc.text("•", 25, yPos + (index * 8));
      doc.text(instruction, 32, yPos + (index * 8));
    });

    // Signature section with cleaner design
    yPos += 45;

    // Light signature background
    doc.setFillColor(...sectionBg);
    doc.rect(15, yPos - 5, 180, 35, "F");

    try {
      // Principal signature
      doc.addImage(principalSignature, "PNG", 40, yPos, 45, 18);
      doc.setDrawColor(...dividerColor);
      doc.setLineWidth(0.75);
      doc.line(40, yPos + 20, 85, yPos + 20);
      doc.setFontSize(8);
      doc.setTextColor(...textColor);
      doc.text("Principal", 62, yPos + 26, { align: "center" });

      // Exam IC signature
      doc.addImage(examIcSignature, "PNG", 125, yPos, 45, 18);
      doc.line(125, yPos + 20, 170, yPos + 20);
      doc.text("Academic In-Charge", 147, yPos + 26, { align: "center" });
    } catch (error) {
      console.error("Error adding signatures to PDF:", error);
      doc.text("Signature Error", 105, yPos + 10, { align: "center" });
    }

    // Clean footer
    const footerY = 270;

    // Subtle top border for footer
    doc.setDrawColor(...dividerColor);
    doc.setLineWidth(0.75);
    doc.line(15, footerY, 195, footerY);

    // Contact information in footer
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")} | 123 Education Street, Knowledge City | Contact: +91 9876543210`,
      105,
      footerY + 15,
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