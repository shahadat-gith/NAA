import { jsPDF } from "jspdf";
import { formatDate } from "./utility";
// import logo from "./NAA_LOGO.png" // Ensure this is a Base64 string or valid URI

const generateAdmitCard = (student, admitCard, principal, examIncharge) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ========= COLOR PALETTE ========= */
    const accentColor = [31, 41, 55]; // Dark Slate/Navy
    const secondaryColor = [243, 244, 246]; // Very Light Gray
    const textMain = [31, 41, 55];
    const textMuted = [107, 114, 128];

    /* ========= HELPER: CAPITALIZE ========= */
    const cap = (s) =>
      s ? s.split(" ").map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "N/A";

    /* ========= PAGE BORDER & BG ========= */
    doc.setDrawColor(229, 231, 235);
    doc.rect(5, 5, 200, 287); // Outer thin border

    /* ========= HEADER SECTION ========= */
    // Add a dark top bar for branding
    doc.setFillColor(...accentColor);
    doc.rect(10, 10, 190, 2, "F");

    // Academy Name & Info
    doc.setTextColor(...textMain);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NASHIB ALI ACADEMY", 105, 22, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    doc.text("Recognized Educational Institution | ESTD. 2015", 105, 27, { align: "center" });

    // Admit Card Badge
    doc.setFillColor(...secondaryColor);
    doc.roundedRect(75, 35, 60, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.text("ADMIT CARD", 105, 43, { align: "center" });

    /* ========= STUDENT PROFILE SECTION ========= */
    // Photo Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(160, 55, 30, 35); 
    doc.setFontSize(8);
    doc.text("Affix Photo", 175, 75, { align: "center" });

    // Info Grid
    doc.setTextColor(...textMain);
    doc.setFontSize(11);
    
    let y = 60;
    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`:  ${value || "N/A"}`, 55, y);
      y += 8;
    };

    row("Student Name", cap(student.name));
    row("Registration No", student.registrationNo);
    row("Roll Number", student.rollNo || "---");
    row("Class / Medium", `${student.class} (${cap(student.medium)})`);
    row("Father's Name", cap(student.fatherName));
    row("Exam Center", cap(admitCard.examCenter));

    /* ========= EXAM SCHEDULE TABLE ========= */
    y = 105;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EXAMINATION SCHEDULE", 15, y);
    
    y += 5;
    // Table Header
    doc.setFillColor(...accentColor);
    doc.rect(15, y, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Subject", 18, y + 6.5);
    doc.text("Date", 85, y + 6.5);
    doc.text("Shift", 125, y + 6.5);
    doc.text("Time", 160, y + 6.5);

    y += 10;
    doc.setTextColor(...textMain);
    doc.setFont("helvetica", "normal");

    admitCard?.exams?.forEach((exam, index) => {
      if (index % 2 !== 0) {
        doc.setFillColor(...secondaryColor);
        doc.rect(15, y, 180, 9, "F");
      }
      doc.setDrawColor(240, 240, 240);
      doc.line(15, y + 9, 195, y + 9); // Row separator line

      doc.text(cap(exam.subject), 18, y + 6);
      doc.text(formatDate(exam.date), 85, y + 6);
      doc.text(cap(exam.shift), 125, y + 6);
      doc.text(exam.time || "-", 160, y + 6);
      y += 9;
    });

    /* ========= INSTRUCTIONS ========= */
    y += 15;
    doc.setFillColor(...secondaryColor);
    doc.rect(15, y, 180, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INSTRUCTIONS FOR CANDIDATE:", 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const instructions = [
      "1. Candidates must carry this admit card to the examination hall.",
      "2. Please report to the exam center 30 minutes before the scheduled time.",
      "3. Possession of electronic gadgets or mobile phones is strictly prohibited."
    ];
    doc.text(instructions.join("\n"), 18, y + 12);

    /* ========= SIGNATURES ========= */
    y = 235;
    const sigLine = 40;
    
    // Principal Signature
    if (principal?.signature?.url) {
      doc.addImage(principal.signature.url, "PNG", 25, y - 15, 40, 12);
    }
    doc.line(20, y, 20 + sigLine, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Principal", 40, y + 5, { align: "center" });

    // In-Charge Signature
    if (examIncharge?.signature?.url) {
      doc.addImage(examIncharge.signature.url, "PNG", 145, y - 15, 40, 12);
    }
    doc.line(150, y, 150 + sigLine, y);
    doc.text("Exam In-Charge", 170, y + 5, { align: "center" });

    /* ========= FOOTER ========= */
    doc.setFillColor(...secondaryColor);
    doc.rect(10, 275, 190, 12, "F");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(
      "www.nashibaliacademy.in  |  Contact: +91 60014-16724  |  Email: info@nashibaliacademy.in",
      105,
      282,
      { align: "center" }
    );

    /* ========= SAVE ========= */
    doc.save(`${cap(student.name)}_AdmitCard.pdf`);
  } catch (error) {
    console.error("Admit card generation failed:", error);
    alert("Failed to generate admit card.");
  }
};

export default generateAdmitCard;