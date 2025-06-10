import { jsPDF } from "jspdf";
import principalSignature from "/principal_sign.png"; // Adjust path
import examIcSignature from "/exam_ic_sign.png"; // Adjust path

const generateAdmitCard = (student, config) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Color definitions (aligned with ResultDownload.css and updated primary color)
    const primaryColor = [74, 144, 226]; // #4A90E2 (soft blue)
    const secondaryColor = [51, 51, 51]; // --text-dark: #333333
    const backgroundColor = [245, 245, 245]; // Light gray (original)
    const borderColor = [234, 234, 234]; // --border-color: #eaeaea

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
    doc.setFillColor(...borderColor);
    doc.rect(60, 40, 90, 10, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ADMIT CARD", 105, 47, { align: "center" });

    // Student Information Section
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 55, 180, 90, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.rect(15, 55, 180, 90);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT INFORMATION", 20, 62);

    doc.setDrawColor(...primaryColor);
    doc.line(20, 64, 140, 64);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const leftCol = 20;
    const rightCol = 80;
    let yPos = 72;
    const lineHeight = 7;

    const capitalizeWords = (str) => {
      if (!str) return "N/A";
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    };

    doc.setFont("helvetica", "bold");
    doc.text("Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.name), rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Registration No:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(student.registrationNo || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Roll No:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(student.result?.rollNo || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Class:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(student.class || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Medium:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.medium), rightCol, yPos);
    yPos += lineHeight;

    if (student.class && parseInt(student.class) > 10 && student.stream) {
      doc.setFont("helvetica", "bold");
      doc.text("Stream:", leftCol, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(capitalizeWords(student.stream), rightCol, yPos);
      yPos += lineHeight;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Father's Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.father) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Mother's Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(student.mother) || "N/A", rightCol, yPos);

    // Examination Details Section
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 150, 180, 60, "F");
    doc.setDrawColor(...borderColor);
    doc.rect(15, 150, 180, 60);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EXAMINATION DETAILS", 20, 157);

    doc.setDrawColor(...primaryColor);
    doc.line(20, 159, 140, 159);

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    yPos = 167;
    doc.setFont("helvetica", "bold");
    doc.text("Exam:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(config.examName) || "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Date:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(config.examDate ? new Date(config.examDate).toLocaleDateString("en-IN") : "N/A", rightCol, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.text("Center:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(capitalizeWords(config.examCenter) || "N/A", rightCol, yPos);

    // Signatures
    yPos = 220;
    try {
      doc.addImage(principalSignature, "PNG", 20, yPos, 60, 20);
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text("Principal's Signature", 50, yPos + 25, { align: "center" });

      doc.addImage(examIcSignature, "PNG", 120, yPos, 60, 20);
      doc.text("Academic In-Charge Signature", 150, yPos + 25, { align: "center" });
    } catch (error) {
      console.error("Error adding signatures to PDF:", error);
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
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

    doc.save(`${capitalizeWords(student.name)}_Admit_Card_${student.registrationNo || student._id || "2025"}.pdf`);
  } catch (error) {
    console.error("Error generating admit card:", error);
    alert("An error occurred while generating the admit card.");
  }
};

export default generateAdmitCard;