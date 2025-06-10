import { jsPDF } from "jspdf";
import { toast } from "react-hot-toast";

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
  doc.text(feeType || "Fee Receipt", 105, 47, { align: "center" });

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
  doc.text(`Name: ${student?.name || "N/A"}`, 20, 72);
  doc.text(`Contact: ${student?.phone || student?.guardianContact || "N/A"}`, 20, 80);

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
  doc.text("Transaction ID:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${transaction?._id || transaction?.transactionId || "N/A"}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Payment Date:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  const paymentDate = transaction?.paymentDate || transaction?.transactionDate;
  doc.text(
    paymentDate ? new Date(paymentDate).toLocaleDateString("en-IN") : "N/A",
    rightCol,
    yPos
  );
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Amount Paid:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(
    transaction?.amount ? `Rs. ${Number(transaction.amount).toLocaleString()}` : "N/A",
    rightCol,
    yPos
  );
  doc.setTextColor(60, 60, 60);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Status:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 128, 0);
  doc.text(
    transaction?.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : "N/A",
    rightCol,
    yPos
  );
  doc.setTextColor(60, 60, 60);

  // Signatures Section
  yPos = 200;
  try {
    // Note: Ensure principal_sign.png and exam_ic_sign.png are accessible in your public folder
    // or use base64 strings. Replace paths with actual file locations or data.
    const principalSig = "/principal_sign.png";
    const examIcSig = "/exam_ic_sign.png";
    doc.addImage(principalSig, "PNG", 20, yPos, 60, 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Principal's Signature", 50, yPos + 25, { align: "center" });

    doc.addImage(examIcSig, "PNG", 120, yPos, 60, 20);
    doc.setFontSize(10);
    doc.text("Academic In-Charge Signature", 150, yPos + 25, { align: "center" });
  } catch (error) {
    console.error("Error adding signatures to PDF:", error);
    doc.setFontSize(10);
    doc.text("Signature Unavailable", 105, yPos + 10, { align: "center" });
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

  try {
    doc.save(`${student?.name || "Student"}_${feeType || "Fee"}_Receipt_${transaction?._id || Date.now()}.pdf`);
  } catch (error) {
    console.error("Error saving PDF:", error);
    toast.error("Failed to save fee receipt PDF");
  }
};

export default generateFeeReceipt;