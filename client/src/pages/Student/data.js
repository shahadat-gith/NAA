import { CLASS_OPTIONS } from "../../Utils/utility";

// 🔹 helper names
const names = [
  "Rahul Sharma",
  "Ayesha Khan",
  "Arjun Das",
  "Riya Paul",
  "Imran Ali",
  "Sneha Bora",
  "Zaid Ahmed",
  "Puja Kalita",
];

let nameIndex = 0;

// 🔹 generate toppers
const generateToppers = () => {
  const sessions = ["2025-2026"];
  const data = [];

  sessions.forEach((session) => {
    Object.keys(CLASS_OPTIONS).forEach((medium) => {
      CLASS_OPTIONS[medium].forEach((cls) => {
        data.push({
          session,
          class: cls,
          medium: medium,
          stream: cls >= 11 ? ["Science", "Arts"][Math.floor(Math.random() * 2)] : "General",
          name: names[nameIndex++ % names.length],
          percentage: Math.floor(85 + Math.random() * 15), // 85–100
          image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        });
      });
    });
  });

  return data;
};

export const toppersData = generateToppers();