/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
  extend: {
    colors: {
      primary: "#ff4d2d",
      background: "#f5f5f5",
      card: "#ffffff",
      border: "#e0e0e0",
      text: "#333333",
    },
  },
},
  plugins: [],
};