import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png"; // Adjust path as needed
import examIcSignature from "/exam_ic_sign.png"; // Adjust path as needed

const generateAdmissionSlip = async (student, backendUrl) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Define colors
  const primaryColor = [0, 51, 102]; // Navy blue
  const secondaryColor = [128, 128, 128]; // Gray

  // Background design elements
  doc.setFillColor(245, 245, 245); // Light gray background
  doc.rect(10, 10, 190, 277, 'F');

  // Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // Decorative header bar
  doc.setFillColor(...primaryColor);
  doc.rect(10, 10, 190, 25, 'F');

  // Header
  doc.setTextColor(255, 255, 255); // White text for header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NASHIB ALI ACADEMY", 105, 25, { align: "center" });

  // Subtitle
  doc.setFillColor(220, 220, 220);
  doc.rect(60, 40, 90, 10, 'F');

  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ADMISSION SLIP", 105, 47, { align: "center" });

  // Registration number and date section
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 55, 180, 15, 'F');

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Registration No: ${student.regNo || "NAA-" + Math.floor(Math.random() * 10000)}`, 20, 64);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString("en-IN")}`, 150, 64);

  // Student Image section - with simulated border radius
  const imgContainerWidth = 35;
  const imgContainerHeight = 45;
  const imgX = 155;
  const imgY = 75;

  // Draw white background for the image area
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(imgX, imgY, imgContainerWidth, imgContainerHeight, 3, 3, 'F');

  // Draw colored border with rounded corners
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(imgX, imgY, imgContainerWidth, imgContainerHeight, 3, 3, 'S');

  // Add the student image
  if (student.image) {
    try {
      const padding = 2;
      doc.saveGraphicsState();
      doc.addImage(
        `${backendUrl}/${student.image}`,
        "JPEG",
        imgX + padding,
        imgY + padding,
        imgContainerWidth - (padding * 2),
        imgContainerHeight - (padding * 2),
        undefined,
        'FAST',
        0
      );
      doc.restoreGraphicsState();
    } catch (error) {
      console.error("Error adding student image to PDF:", error);
      doc.setFontSize(8);
      doc.text("Photo", imgX + imgContainerWidth / 2, imgY + imgContainerHeight / 2, { align: "center" });
    }
  } else {
    doc.setFontSize(8);
    doc.text("Photo", imgX + imgContainerWidth / 2, imgY + imgContainerHeight / 2, { align: "center" });
  }

  // Student Details section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT DETAILS", 20, 80);

  // Horizontal line under section heading
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 82, 140, 82);

  // Student information
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const leftCol = 25;
  const rightCol = 70;
  let yPos = 90;
  const lineHeight = 8;

  doc.setFont("helvetica", "bold");
  doc.text("Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.name}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Class:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.class.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" - ")}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Date of Birth:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${new Date(student.dob).toLocaleDateString("en-IN")}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Father's Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.fatherName}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Mother's Name:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.motherName}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.phone}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Email:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${student.email}`, rightCol, yPos);
  yPos += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("Address:", leftCol, yPos);
  const address = `${student.address}, ${student.district}, ${student.state} - ${student.pincode}`;
  const addressLines = doc.splitTextToSize(address, 120);
  doc.setFont("helvetica", "normal");
  doc.text(addressLines, rightCol, yPos);
  yPos += (addressLines.length * lineHeight);

  doc.setFont("helvetica", "bold");
  doc.text("Status:", leftCol, yPos);
  doc.setFont("helvetica", "normal");
  if (student.status.toLowerCase() === "approved") {
    doc.setTextColor(0, 128, 0);
  } else if (student.status.toLowerCase() === "pending") {
    doc.setTextColor(255, 165, 0);
  } else if (student.status.toLowerCase() === "rejected") {
    doc.setTextColor(255, 0, 0);
  }
  doc.text(`${student.status}`, rightCol, yPos);
  doc.setTextColor(60, 60, 60);

  // Terms and conditions
  yPos += lineHeight * 2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("TERMS & CONDITIONS", 20, yPos);
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 140, yPos + 2);
  yPos += lineHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const terms = [
    "1. This admission slip must be presented on the first day of school.",
    "2. All fees must be paid by the due date to avoid late fees.",
    "3. Original documents must be presented for verification.",
    "4. Uniform is mandatory from the first day of classes."
  ];

  terms.forEach(term => {
    doc.text(term, 25, yPos);
    yPos += lineHeight - 2;
  });

  // Signatures at the bottom (before footer)
  yPos += lineHeight;
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
  doc.text("123 Education Street, Knowledge City - 100001 | Phone: +91 9876543210 | www.nashibaliacademy.edu", 105, 284, { align: "center" });

  // Save the PDF
  doc.save(`${student.name}_Admission_Slip.pdf`);
};

export default generateAdmissionSlip;