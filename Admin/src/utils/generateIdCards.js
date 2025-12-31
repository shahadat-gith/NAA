import jsPDF from "jspdf";

const SCHOOL_DETAILS = {
  name: "Nashib Ali Academy",
  address: "123 Education Lane, Knowledge City",
  contact: "Phone: (123) 456-7890 | Email: info@nashibaliacademy.edu",
  logo: "/NAA_LOGO.png",
};

// Professional color palette
const COLORS = {
  primary: [13, 71, 161],      // Deep Blue
  secondary: [25, 118, 210],   // Lighter Blue
  accent: [255, 167, 38],      // Warm Orange
  success: [46, 125, 50],      // Forest Green
  text: [33, 33, 33],          // Almost Black
  textLight: [97, 97, 97],     // Gray
  background: [250, 250, 252], // Off White
  border: [189, 189, 189],     // Light Gray
};

// ID Card dimensions (mm)
const CARD_WIDTH = 85.6;
const CARD_HEIGHT = 53.98;
const CARDS_PER_ROW = 2;
const CARDS_PER_COL = 3;
const CARDS_PER_PAGE = 6;

/* ================= LOAD IMAGE AS BASE64 ================= */
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
};

/* ================= DRAW LOGO PLACEHOLDER ================= */
const drawLogoPlaceholder = (doc, x, y) => {
  // Modern gradient-like effect with multiple circles
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 8, y + 7, 5, "F");
  
  doc.setFillColor(...COLORS.accent);
  doc.circle(x + 8, y + 7, 4, "F");
  
  doc.setFillColor(...COLORS.primary);
  doc.circle(x + 8, y + 7, 2.5, "F");
  
  doc.setFontSize(4);
  doc.setFont(undefined, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("NAA", x + 6.2, y + 7.8);
};

/* ================= DRAW PHOTO PLACEHOLDER ================= */
const drawPhotoPlaceholder = (doc, x, y, w, h) => {
  // Soft gradient background
  doc.setFillColor(...COLORS.background);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, "F");

  // Outer circle
  const cx = x + w / 2;
  const cy = y + h / 2;

  doc.setFillColor(...COLORS.secondary);
  doc.circle(cx, cy, 7, "F");
  
  doc.setFillColor(...COLORS.primary);
  doc.circle(cx, cy, 5.5, "F");

  // Camera icon representation
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, 2, "F");
  doc.rect(cx - 3, cy - 4, 6, 2, "F");

  // Text
  const text = "PHOTO";
  const fontSize = 6;

  doc.setFontSize(fontSize);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.secondary);

  const textWidth = doc.getTextWidth(text);
  const textHeight = fontSize * 0.35;

  doc.text(text, cx - textWidth / 2, cy + textHeight + 10);
};

/* ================= DRAW SINGLE ID CARD ================= */
const drawIdCard = (doc, student, x, y, studentPhoto, logoData) => {
  // Card background with shadow effect
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, CARD_WIDTH, CARD_HEIGHT, 2, 2, "F");
  
  // Card border
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, CARD_WIDTH, CARD_HEIGHT, 2, 2, "S");

  // Modern header with gradient effect (simulated with layered rectangles)
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(x, y, CARD_WIDTH, 14, 2, 2, "F");
  
  // Lighter overlay for depth
  doc.setFillColor(...COLORS.secondary);
  doc.setGState(doc.GState({ opacity: 0.3 }));
  doc.roundedRect(x, y + 7, CARD_WIDTH, 7, 0, 0, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // Decorative corner accent
  doc.setFillColor(...COLORS.accent);
  doc.triangle(x + CARD_WIDTH - 15, y, x + CARD_WIDTH, y, x + CARD_WIDTH, y + 15, "F");
  doc.setGState(doc.GState({ opacity: 0.15 }));
  doc.triangle(x + CARD_WIDTH - 15, y, x + CARD_WIDTH, y, x + CARD_WIDTH, y + 15, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // Logo with shadow
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", x + 3, y + 3, 10, 10);
    } catch {
      drawLogoPlaceholder(doc, x, y);
    }
  } else {
    drawLogoPlaceholder(doc, x, y);
  }

  // School name with better typography
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(SCHOOL_DETAILS.name, x + 15, y + 8);
  
  // Subtitle
  doc.setFontSize(6);
  doc.setFont(undefined, "normal");
  doc.text("Student Identity Card", x + 15, y + 11.5);

  // Modern accent line with gradient effect
  doc.setFillColor(...COLORS.accent);
  doc.rect(x + 3, y + 14.5, CARD_WIDTH - 6, 1.5, "F");

  /* ================= PHOTO (RIGHT SIDE) ================= */
  const photoW = 22;
  const photoH = 27;
  const photoX = x + CARD_WIDTH - photoW - 4;
  const photoY = y + 18;

  // Photo frame with modern shadow
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(photoX - 1, photoY - 1, photoW + 2, photoH + 2, 2, 2, "F");

  // Inner white frame
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(photoX - 0.5, photoY - 0.5, photoW + 1, photoH + 1, 1.5, 1.5, "F");

  if (studentPhoto) {
    try {
      doc.addImage(studentPhoto, "JPEG", photoX, photoY, photoW, photoH);
    } catch {
      drawPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
    }
  } else {
    drawPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
  }

  /* ================= DETAILS (LEFT SIDE) ================= */
  const detailsX = x + 4;
  let currentY = y + 21;
  const lh = 5.5;

  doc.setFontSize(8);

  const drawRow = (label, value) => {
    // Label with background badge
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.primary);
    const labelWidth = doc.getTextWidth(label);
    
    // Subtle background for label
    doc.setFillColor(...COLORS.background);
    doc.roundedRect(detailsX - 0.5, currentY - 3, labelWidth + 1, 4, 0.5, 0.5, "F");
    
    doc.text(label, detailsX, currentY);
    
    // Colon
    doc.setTextColor(...COLORS.textLight);
    doc.text(":", detailsX + 15, currentY);
    
    // Value
    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLORS.text);
    doc.text(value || "N/A", detailsX + 17, currentY);
    currentY += lh;
  };

  drawRow("Name", student.name?.slice(0, 22));
  drawRow("Class", student.class);

  // Stream only for 11 & 12
  if ((student.class === "11" || student.class === "12") && student.stream) {
    drawRow("Stream", student.stream);
  }

  drawRow("Medium", student.medium);
  drawRow("Reg No", student.registrationNo);

  /* ================= FOOTER ================= */
  const footerY = y + CARD_HEIGHT - 8;
  
  // Modern footer with gradient
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(x, footerY, CARD_WIDTH, 8, 0, 0, "F");
  
  // Accent bar on top
  doc.setFillColor(...COLORS.accent);
  doc.rect(x, footerY, CARD_WIDTH, 1, "F");

  // Decorative elements
  doc.setFillColor(255, 255, 255);
  doc.setGState(doc.GState({ opacity: 0.3 }));
  doc.circle(x + 3, footerY + 4, 1.5, "F");
  doc.circle(x + CARD_WIDTH - 3, footerY + 4, 1.5, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  // Footer text with better formatting
  doc.setFontSize(5.5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(255, 255, 255);
  doc.text(SCHOOL_DETAILS.address, x + CARD_WIDTH / 2, footerY + 3, {
    align: "center",
  });
  
  doc.setFontSize(5);
  doc.setGState(doc.GState({ opacity: 0.9 }));
  doc.text(SCHOOL_DETAILS.contact, x + CARD_WIDTH / 2, footerY + 6, {
    align: "center",
  });
  doc.setGState(doc.GState({ opacity: 1 }));
};

/* ================= GENERATE ID CARDS ================= */
export const generateIdCards = async (students, mediumFilter, classFilter) => {
  if (!students.length) return;

  let logoData = null;
  try {
    logoData = await loadImage(SCHOOL_DETAILS.logo);
  } catch {}

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const hSpace = (pageW - CARD_WIDTH * CARDS_PER_ROW) / (CARDS_PER_ROW + 1);
  const vSpace = (pageH - CARD_HEIGHT * CARDS_PER_COL) / (CARDS_PER_COL + 1);

  students.forEach((student, i) => {
    if (i > 0 && i % CARDS_PER_PAGE === 0) doc.addPage();

    const idx = i % CARDS_PER_PAGE;
    const row = Math.floor(idx / CARDS_PER_ROW);
    const col = idx % CARDS_PER_ROW;

    const x = hSpace + col * (CARD_WIDTH + hSpace);
    const y = vSpace + row * (CARD_HEIGHT + vSpace);

    drawIdCard(doc, student, x, y, null, logoData);
  });

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`ID_Cards_${mediumFilter}_${classFilter}_${date}.pdf`);
};