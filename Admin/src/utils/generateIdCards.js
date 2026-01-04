import jsPDF from "jspdf";
import { capitalizeFirst, capitalizeWords } from "./utility";

const SCHOOL_DETAILS = {
  name: "Nashib Ali Academy",
  address: "Shimulbari Mahachara Chariali, Barpeta, Assam",
  contact: "Phone: 60014-16724| Email: nashibaliacademy.offl@gmail.com",
  logo: "/NAA_LOGO.png",
};

/* ================= COLORS ================= */

const COLORS = {
  primary: [13, 71, 161],
  secondary: [25, 118, 210],
  accent: [255, 167, 38],
  success: [46, 125, 50],
  text: [33, 33, 33],
  textLight: [97, 97, 97],
  background: [250, 250, 252],
  border: [189, 189, 189],
};

/* ================= CARD CONFIG ================= */

const CARD_WIDTH = 85.6;
const CARD_HEIGHT = 53.98;
const CARDS_PER_ROW = 2;
const CARDS_PER_COL = 3;
const CARDS_PER_PAGE = 6;

/* ================= IMAGE LOADER ================= */

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });

/* ================= PLACEHOLDERS ================= */

const drawLogoPlaceholder = (doc, x, y) => {
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

const drawPhotoPlaceholder = (doc, x, y, w, h) => {
  doc.setFillColor(...COLORS.background);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, "F");

  const cx = x + w / 2;
  const cy = y + h / 2;

  doc.setFillColor(...COLORS.secondary);
  doc.circle(cx, cy, 7, "F");

  doc.setFillColor(...COLORS.primary);
  doc.circle(cx, cy, 5.5, "F");

  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, 2, "F");
  doc.rect(cx - 3, cy - 4, 6, 2, "F");

  doc.setFontSize(6);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.secondary);
  doc.text("PHOTO", cx - 8, cy + 12);
};

/* ================= DRAW SINGLE CARD ================= */

const drawIdCard = (doc, student, x, y, studentPhoto, logoData) => {
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, CARD_WIDTH, CARD_HEIGHT, 2, 2, "F");

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, CARD_WIDTH, CARD_HEIGHT, 2, 2, "S");

  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(x, y, CARD_WIDTH, 14, 2, 2, "F");

  doc.setFillColor(...COLORS.secondary);
  doc.setGState(doc.GState({ opacity: 0.3 }));
  doc.roundedRect(x, y + 7, CARD_WIDTH, 7, 0, 0, "F");
  doc.setGState(doc.GState({ opacity: 1 }));

  doc.setFillColor(...COLORS.accent);
  doc.triangle(
    x + CARD_WIDTH - 15,
    y,
    x + CARD_WIDTH,
    y,
    x + CARD_WIDTH,
    y + 15,
    "F"
  );

  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", x + 3, y + 3, 10, 10);
    } catch {
      drawLogoPlaceholder(doc, x, y);
    }
  } else {
    drawLogoPlaceholder(doc, x, y);
  }

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(SCHOOL_DETAILS.name, x + 15, y + 8);

  doc.setFontSize(6);
  doc.setFont(undefined, "normal");
  doc.text("Student Identity Card", x + 15, y + 11.5);

  doc.setFillColor(...COLORS.accent);
  doc.rect(x + 3, y + 14.5, CARD_WIDTH - 6, 1.5, "F");

  /* ================= PHOTO ================= */

  const photoW = 22;
  const photoH = 27;
  const photoX = x + CARD_WIDTH - photoW - 4;
  const photoY = y + 18;

  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(photoX - 1, photoY - 1, photoW + 2, photoH + 2, 2, 2, "F");

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

  /* ================= DETAILS ================= */

  const detailsX = x + 4;
  let currentY = y + 21;
  const lh = 5.5;

  doc.setFontSize(8);

  const drawRow = (label, value) => {
    doc.setFont(undefined, "bold");
    doc.setTextColor(...COLORS.primary);
    doc.text(label, detailsX, currentY);

    doc.setFont(undefined, "normal");
    doc.setTextColor(...COLORS.text);
    doc.text(value || "N/A", detailsX + 17, currentY);

    currentY += lh;
  };

  drawRow("Name", capitalizeWords(student.name)?.slice(0, 22));
  drawRow("Class", student.class);

  if (["11", "12"].includes(student.class) && student.stream) {
    drawRow("Stream", capitalizeFirst(student.stream));
  }

  drawRow("Medium", capitalizeFirst(student.medium));
  drawRow("Reg No", student.registrationNo);

  /* ================= FOOTER ================= */

  const footerY = y + CARD_HEIGHT - 8;

  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(x, footerY, CARD_WIDTH, 8, 0, 0, "F");

  doc.setFillColor(...COLORS.accent);
  doc.rect(x, footerY, CARD_WIDTH, 1, "F");

  doc.setFontSize(5.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    capitalizeWords(SCHOOL_DETAILS.address),
    x + CARD_WIDTH / 2,
    footerY + 3,
    { align: "center" }
  );

  doc.setFontSize(5);
  doc.text(
    SCHOOL_DETAILS.contact,
    x + CARD_WIDTH / 2,
    footerY + 6,
    { align: "center" }
  );
};

/* ================= GENERATE ================= */

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
