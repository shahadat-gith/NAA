/**
 * Trims and purges formatting artifacts from an incoming telephone string.
 * Automatically strips country codes (+91, 91) and leading zeros to return 
 * a strict, clean local phone format.
 * 
 * @param {string} phone - Raw input string from input fields.
 * @returns {string} Cleaned baseline digits.
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return "";
  
  let cleaned = phone
    .trim()
    .replace(/[^0-9+]/g, "") // Keep only digits and +
    .replace(/^(\+?91)/, "") // Remove +91 or 91
    .replace(/^0+/, "");     // Remove leading zeros

  return cleaned;
};






