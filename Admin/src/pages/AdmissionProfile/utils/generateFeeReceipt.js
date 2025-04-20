import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png"; // Adjust path as needed
import examIcSignature from "/exam_ic_sign.png"; // Adjust path as needed
// Custom function to format numbers with commas
const formatNumber = (number) => {
  return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const generateFeeReceipt = (student, transaction, feeType) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Define colors
  const primaryColor = [0, 51, 102]; // Navy blue
  const backgroundColor = [245, 245, 245]; // Light gray

  // Background
  doc.setFillColor(...backgroundColor);
  doc.rect(10, 10, 190, 277, "F");

  // Outer border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // Header section
  doc.setFillColor(...primaryColor);
  doc.rect(10, 10, 190, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NASHIB ALI ACADEMY", 105, 25, { align: "center" });

  // Subtitle
  doc.setFillColor(220, 220, 220);
  doc.rect(60, 40, 90, 10, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${feeType}`, 105, 47, { align: "center" });

  // Student Info Section
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 55, 180, 35, "F");

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
  doc.text(`Name: ${student.firstName} ${student.middleName ? student.middleName: "" } ${student.lastName}  `, 20, 72);
  doc.text(`Contact: ${student.guardianContact || student.phone || 'N/A'}`, 20, 80); // Use guardianContact or phone, fallback to N/A

  // Payment Details Section
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 95, 180, 95, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT DETAILS", 20, 102);

  doc.setDrawColor(...primaryColor);
  doc.line(20, 104, 140, 104);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const leftCol = 20;
  const rightCol = 80;
  let yPos = 112;
  const lineHeight = 8;

  doc.setFont("helvetica", "bold");
  doc.text("Transaction ID:", leftCol, yPos); // Use a generic ID field
  doc.setFont("helvetica", "normal");
  doc.text(`${transaction._id || 'N/A'}`, rightCol, yPos); // Fallback to _id
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Payment Date:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${new Date(transaction.paymentDate || transaction.transactionDate).toLocaleDateString("en-IN")}`, rightCol, yPos); // Handle both fields
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Amount Paid:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${formatNumber(transaction.amount)}`, rightCol, yPos);
  doc.setTextColor(60, 60, 60);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Status:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 128, 0); // Green for completed
  doc.text(`${transaction.status || 'N/A'}`, rightCol, yPos); // Fallback to N/A
  doc.setTextColor(60, 60, 60);

  // Signatures Section
  yPos = 200;
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

  doc.save(`${student.firstName}_${feeType}_Receipt_${transaction._id || Date.now()}.pdf`);
};

export default generateFeeReceipt;