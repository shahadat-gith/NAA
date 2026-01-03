import { jsPDF } from "jspdf";
import {formatDate} from "./utility"

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
    try {
        doc.addImage(logoPath, "PNG", 15, 12, 22, 22);
    } catch (e) {
        console.warn("Logo not found at /public/NAA_LOGO.png");
    }

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

    row("Student Name", cap(student?.name));
    row("Registration No", student?.registrationNo);
    row("Class / Medium", `${student?.class || "N/A"} (${cap(student?.medium)})`);
    row("Father's Name", cap(student?.fatherName));
    row("Mother's Name", cap(student?.motherName));
    row("Exam Center", cap(admitCard?.examCenter));

    /* ========= EXAM SCHEDULE SECTION ========= */
    y += 10; 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accentColor);
    doc.text("EXAMINATION SCHEDULE", 20, y);
    
    y += 5;
    doc.setFillColor(...accentColor);
    doc.rect(15, y, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.text("Date", 18, y + 6.5); 
    doc.text("Morning Shift (9:00 AM - 12:00 PM)", 55, y + 6.5);
    doc.text("Afternoon Shift (2:00 PM - 5:00 PM)", 125, y + 6.5);

    y += 10;
    doc.setTextColor(...textMain);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // Grouping subjects by date
    const groupedExams = (admitCard?.exams || []).reduce((acc, exam) => {
      const dateKey = formatDate(exam.date);
      if (!acc[dateKey]) acc[dateKey] = { date: dateKey, morning: "-", afternoon: "-" };
      
      if (exam.shift?.toLowerCase() === "morning") acc[dateKey].morning = cap(exam.subject);
      if (exam.shift?.toLowerCase() === "afternoon") acc[dateKey].afternoon = cap(exam.subject);
      
      return acc;
    }, {});

    const examDates = Object.values(groupedExams).slice(0, 8);

    examDates.forEach((examRow, index) => {
      if (index % 2 !== 0) {
        doc.setFillColor(...secondaryColor);
        doc.rect(15, y, 180, 9, "F");
      }
      doc.setDrawColor(235, 235, 235);
      doc.line(15, y + 9, 195, y + 9); 

      doc.text(examRow.date, 18, y + 6);
      doc.text(examRow.morning, 55, y + 6);
      doc.text(examRow.afternoon, 125, y + 6);
      y += 9;
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

    /* ========= SIGNATURES (FIXED AT BOTTOM) ========= */
    const sigY = 270; 
    const sigLine = 50;
    doc.setDrawColor(180, 180, 180);
    
    if (principal?.signature?.url) {
        try {
            doc.addImage(principal.signature.url, "PNG", 20, sigY - 18, 40, 15); 
        } catch (e) { console.error("Principal signature failed"); }
    }
    doc.line(15, sigY, 15 + sigLine, sigY);
    doc.setFont("helvetica", "bold");
    doc.text("Principal's Signature", 15 + (sigLine/2), sigY + 5, { align: "center" });

    if (examIncharge?.signature?.url) {
        try {
            doc.addImage(examIncharge.signature.url, "PNG", 145, sigY - 18, 40, 15);
        } catch (e) { console.error("In-charge signature failed"); }
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

    doc.save(`${cap(student?.name || "Student")}_AdmitCard.pdf`);
  } catch (error) {
    console.error("Admit card generation failed:", error);
  }
};

export default generateAdmitCard;