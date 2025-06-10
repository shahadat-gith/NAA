import { jsPDF } from "jspdf";

const generateIdCard = (student) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Color definitions (aligned with ResultDownload.css and updated primary color)
    const primaryColor = [74, 144, 226]; // #4A90E2
    const secondaryColor = [51, 51, 51]; // --text-dark: #333333
    const backgroundColor = [245, 245, 245]; // Light gray

    // Background
    doc.setFillColor(...backgroundColor);
    doc.rect(0, 0, 210, 297, "F");

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("NASHIB ALI ACADEMY ID CARD", 105, 20, { align: "center" });

    // Student Info
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const capitalizeWords = (str) => {
      if (!str) return "N/A";
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    };

    doc.text(`Name: ${capitalizeWords(student.name)}`, 20, 50);
    doc.text(`Registration No: ${student.registrationNo || "N/A"}`, 20, 60);
    doc.text(`Class: ${student.class || "N/A"}`, 20, 70);
    doc.text(`Medium: ${capitalizeWords(student.medium)}`, 20, 80);
    if (student.class && parseInt(student.class) > 10 && student.stream) {
      doc.text(`Stream: ${capitalizeWords(student.stream)}`, 20, 90);
    }

    doc.save(`${capitalizeWords(student.name)}_ID_Card_${student.registrationNo || student._id || "2025"}.pdf`);
  } catch (error) {
    console.error("Error generating ID card:", error);
    alert("An error occurred while generating the ID card.");
  }
};

export default generateIdCard;