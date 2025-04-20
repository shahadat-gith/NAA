import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png"; // Adjust path
import examIcSignature from "/exam_ic_sign.png"; // Adjust path

const generateAdmitCard = (student, config) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

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
  doc.rect(15, 55, 180, 90, "F"); // Increased height from 80mm to 90mm to fit registrationNo and rollNo

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

  doc.setFont("helvetica", "bold");
  doc.text("Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${student.firstName} ${student.middleName ? student.middleName + " " : ""}${student.lastName || ""}`,
    rightCol,
    yPos
  );
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Registration No:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.registrationNo}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Roll No:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.rollNo || "N/A"}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Class:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.class}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Medium:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(student.medium.charAt(0).toUpperCase() + student.medium.slice(1).toLowerCase(), rightCol, yPos);
  yPos += lineHeight;

  if (student.stream) {
    doc.setFont("helvetica", "bold");
    doc.text("Stream:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.stream.charAt(0).toUpperCase() + student.stream.slice(1).toLowerCase()}`, rightCol, yPos);
    yPos += lineHeight;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Father's Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.fatherName || "N/A"}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Mother's Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.motherName || "N/A"}`, rightCol, yPos);

  // Examination Details Section (shifted down due to extended Student Information section)
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 150, 180, 60, "F"); // Shifted from y=140 to y=150

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EXAMINATION DETAILS", 20, 157); // Adjusted y position

  doc.setDrawColor(...primaryColor);
  doc.line(20, 159, 140, 159); // Adjusted y position

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  yPos = 167; // Adjusted y position
  doc.setFont("helvetica", "bold");
  doc.text("Exam:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${config.examName || "N/A"}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Date:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${config.examDate ? new Date(config.examDate).toLocaleDateString("en-IN") : "N/A"}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Center:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${config.examCenter || "N/A"}`, rightCol, yPos);

  // Signatures (shifted down)
  yPos = 220; // Adjusted y position from 210 to 220
  try {
    doc.addImage(principalSignature, "PNG", 20, yPos, 60, 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Principal's Signature", 50, yPos + 25, { align: "center" });

    doc.addImage(examIcSignature, "PNG", 120, yPos, 60, 20);
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

  doc.save(`${student.firstName}_Admit_Card_${student.registrationNo || student._id || "2025"}.pdf`);
};

export default generateAdmitCard;