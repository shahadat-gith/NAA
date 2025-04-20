import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png"; // Adjust path as needed
import examIcSignature from "/exam_ic_sign.png"; // Adjust path as needed

// Custom function to format numbers with commas
const formatNumber = (number) => {
  return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const generateTransactionReceipt = (student, transaction) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Define colors
  const primaryColor = [0, 51, 102]; // Navy blue
  const secondaryColor = [128, 128, 128]; // Gray
  const backgroundColor = [245, 245, 245]; // Light gray

  // Background
  doc.setFillColor(...backgroundColor);
  doc.rect(10, 10, 190, 277, 'F');

  // Outer border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // Header section
  doc.setFillColor(...primaryColor);
  doc.rect(10, 10, 190, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NASHIB ALI ACADEMY", 105, 25, { align: "center" });

  // Subtitle
  doc.setFillColor(220, 220, 220);
  doc.rect(60, 40, 90, 10, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TRANSACTION RECEIPT", 105, 47, { align: "center" });

  // Student Info Section
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 55, 180, 35, 'F'); // Background for student info

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT INFORMATION", 20, 62);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 64, 140, 64); // Line under heading

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${student.name}`, 20, 72);
  doc.text(`Email: ${student.email}`, 20, 80);
  doc.text(`Class: ${student.class.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" - ")}`, 20, 88);

  // Transaction Details Section
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 95, 180, 95, 'F'); // Background for transaction details

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT DETAILS", 20, 102);

  doc.setDrawColor(...primaryColor);
  doc.line(20, 104, 140, 104); // Line under heading

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const leftCol = 20;
  const rightCol = 80;
  let yPos = 112;
  const lineHeight = 8;

  // Transaction details in two columns
  doc.setFont("helvetica", "bold");
  doc.text("Payment ID:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${transaction.paymentId}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${transaction.orderId}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Transaction Date:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${new Date(transaction.transactionDate).toLocaleDateString("en-IN")}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Admission Fee:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`Rs. ${formatNumber(transaction.admissionFee)}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Hostel Admission Fee:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`Rs. ${formatNumber(transaction.hostelAdmissionFee)}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Other Charges:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  const otherCharges = parseInt(transaction.amount) - parseInt(transaction.admissionFee) - parseInt(transaction.hostelAdmissionFee);
  doc.text(`Rs. ${formatNumber(otherCharges)}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${formatNumber(transaction.amount)}`, rightCol, yPos);
  doc.setTextColor(60, 60, 60);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Status:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  if (transaction.status.toLowerCase() === "success") {
    doc.setTextColor(0, 128, 0); // Green for success
  } else if (transaction.status.toLowerCase() === "pending") {
    doc.setTextColor(255, 165, 0); // Orange for pending
  } else {
    doc.setTextColor(255, 0, 0); // Red for failed
  }
  doc.text(`${transaction.status}`, rightCol, yPos);
  doc.setTextColor(60, 60, 60);

  // Signatures Section
  yPos = 200; // Fixed position for signatures
  try {
    // Principal's Signature
    doc.addImage(principalSignature, 'PNG', 20, yPos, 60, 20); // Left side
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Principal's Signature", 50, yPos + 25, { align: "center" });

    // Exam In-Charge Signature
    doc.addImage(examIcSignature, 'PNG', 120, yPos, 60, 20); // Right side
    doc.setFontSize(10);
    doc.text("Academic In-Charge Signature", 150, yPos + 25, { align: "center" });
  } catch (error) {
    console.error("Error adding signatures to PDF:", error);
    doc.setFontSize(10);
    doc.text("Signature Error", 105, yPos + 10, { align: "center" });
  }

  // Footer
  doc.setFillColor(...primaryColor);
  doc.rect(10, 270, 190, 17, 'F');

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

  // Save the PDF
  doc.save(`${student.name}_Transaction_Receipt_${transaction.paymentId}.pdf`);
};

export default generateTransactionReceipt;