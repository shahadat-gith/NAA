import { jsPDF } from "jspdf";
import { formatDate } from "./utility";

const generateAdmitCard = (student, admitCard, principal, examIncharge) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ========= SETTINGS & PATHS ========= */
    const logoPath = "/NAA_LOGO.png"; 
    const accentColor = [31, 41, 55]; 
    const secondaryColor = [243, 244, 246]; 
    const textMain = [40, 40, 40];
    const textMuted = [100, 100, 100];

    const cap = (s) =>
      s ? s.split(" ").map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "N/A";

    /* ========= PAGE BORDER ========= */
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287); 

    /* ========= HEADER SECTION ========= */
    doc.addImage(logoPath, "PNG", 15, 12, 22, 22);

    doc.setTextColor(...textMain);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NASHIB ALI ACADEMY", 110, 22, { align: "center" }); 
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    doc.text("Recognized Educational Institution | ESTD. 2015", 110, 27, { align: "center" }); 

    doc.setFillColor(...secondaryColor);
    doc.roundedRect(80, 38, 60, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...accentColor);
    doc.text("ADMIT CARD", 110, 46, { align: "center" }); 

    /* ========= STUDENT INFORMATION ========= */
    doc.setTextColor(...textMain);
    doc.setFontSize(10);
    
    let y = 65;
    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`:  ${value || "N/A"}`, 60, y);
      y += 8;
    };

    row("Student Name", cap(student.name)); 
    row("Registration No", student.registrationNo); 
    row("Class / Medium", `${student.class} (${cap(student.medium)})`); 
    row("Father's Name", cap(student.fatherName)); 
    row("Mother's Name", cap(student.motherName)); 
    row("Exam Center", cap(admitCard.examCenter)); 

    /* ========= EXAM SCHEDULE SECTION ========= */
    y += 10; 
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accentColor);
    doc.text("EXAMINATION SCHEDULE", 20, y); 
    
    y += 5;
    // Updated Table Header for Dual Shifts
    doc.setFillColor(...accentColor);
    doc.rect(15, y, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Date", 18, y + 6.5); 
    doc.text("Morning Shift", 65, y + 6.5); // Label for Morning
    doc.text("Afternoon Shift", 130, y + 6.5); // Label for Afternoon

    y += 10;
    doc.setTextColor(...textMain);
    doc.setFont("helvetica", "normal");

    // Map through exams (assuming your data is grouped by date, or handled per row)
    admitCard?.exams?.slice(0, 8).forEach((exam, index) => {
      if (index % 2 !== 0) {
        doc.setFillColor(...secondaryColor);
        doc.rect(15, y, 180, 12, "F"); // Increased height slightly for better readability
      }
      doc.setDrawColor(235, 235, 235);
      doc.line(15, y + 12, 195, y + 12); 

      doc.setFontSize(9);
      // Column 1: Date
      doc.text(formatDate(exam.date), 18, y + 7); 

      // Column 2: Morning Subject & Time
      if (exam.shift?.toLowerCase() === "morning") {
        doc.setFont("helvetica", "bold");
        doc.text(cap(exam.subject), 65, y + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(exam.time || "", 65, y + 9);
      } else {
        doc.text("-", 65, y + 7);
      }

      doc.setFontSize(9);
      // Column 3: Afternoon Subject & Time
      if (exam.shift?.toLowerCase() === "afternoon") {
        doc.setFont("helvetica", "bold");
        doc.text(cap(exam.subject), 130, y + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(exam.time || "", 130, y + 9);
      } else {
        doc.text("-", 130, y + 7);
      }

      y += 12;
    });

    /* ========= INSTRUCTIONS ========= */
    y += 8;
    doc.setDrawColor(...secondaryColor);
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(15, y, 180, 24, 2, 2, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accentColor);
    doc.text("IMPORTANT INSTRUCTIONS:", 18, y + 6); 
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    const instructions = [
      "• Candidates must present this card for entry into the examination hall.", 
      "• Please arrive at the center at least 15 minutes before the start time.", 
      "• Use of unfair means or mobile phones will lead to immediate disqualification." 
    ];
    doc.text(instructions.join("\n"), 18, y + 11);

    /* ========= SIGNATURES (FIXED ABOVE FOOTER) ========= */
    const sigY = 270; 
    const sigLine = 50;
    doc.setDrawColor(180, 180, 180);
    
    if (principal?.signature?.url) {
      doc.addImage(principal.signature.url, "PNG", 20, sigY - 18, 40, 15); 
    }
    doc.line(15, sigY, 15 + sigLine, sigY);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textMain);
    doc.text("Principal's Signature", 15 + (sigLine/2), sigY + 5, { align: "center" }); 

    if (examIncharge?.signature?.url) {
      doc.addImage(examIncharge.signature.url, "PNG", 145, sigY - 18, 40, 15);
    }
    doc.line(145, sigY, 145 + sigLine, sigY);
    doc.text("Exam In-Charge", 145 + (sigLine/2), sigY + 5, { align: "center" }); 

    /* ========= FOOTER ========= */
    doc.setFillColor(...secondaryColor);
    doc.rect(5, 282, 200, 10, "F");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(
      "Nashib Ali Academy | +91 60014-16724 | www.nashibaliacademy.in", 
      105,
      288,
      { align: "center" }
    );

    doc.save(`${cap(student.name)}_AdmitCard.pdf`);
  } catch (error) {
    console.error("Admit card generation failed:", error);
    alert("Failed to generate admit card.");
  }
};

export default generateAdmitCard;