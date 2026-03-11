import jsPDF from "jspdf";

const generateAdmissionSlip = (student = {}, principal = {}) => {
  if (!student) return;

  const doc = new jsPDF();
  const addr = student.address || {};

  const safe = (v) => (v && v !== "" ? v : "N/A");

  let y = 20;

  /* ================= HEADER ================= */
  doc.setFontSize(16);
  doc.text("Admission Confirmation Letter", 105, y, { align: "center" });

  y += 10;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);

  y += 12;
  doc.setFontSize(11);

  /* ================= CONTENT ================= */
  const row = (label, value) => {
    doc.text(`${label}:`, 20, y);
    doc.text(safe(value), 80, y);
    y += 8;
  };

  row("Name", student.name);
  row("Registration No", student.registrationNo);
  row("Class", student.class);
  row("Medium", student.medium);
  row("Stream", student.stream);
  row("Father Name", student.fatherName);
  row("Mother Name", student.motherName);
  row("DOB", student.dob);
  row("Gender", student.gender);
  row("Phone", student.phone);
  row("Aadhar", student.aadhar);
  row("PEN", student.pen);

  /* ================= FOOTER ================= */
  y += 20;

  // Principal Signature Image (if exists)
  if (principal?.signature?.url) {
    try {
      doc.addImage(
        principal.signature.url,
        "PNG",
        20,
        y - 12,
        40,
        18
      );
    } catch (e) {
      console.warn("Principal signature image failed to load");
    }
  }

  doc.text("_______________________", 20, y);
  doc.text(
    principal?.name || "Principal",
    20,
    y + 6
  );

  doc.text("_______________________", 130, y);
  doc.text("Office Seal", 130, y + 6);

  /* ================= SAVE ================= */
  doc.save(
    `Admission_Slip_${safe(student.name) || "student"}.pdf`
  );
};

export default generateAdmissionSlip;
