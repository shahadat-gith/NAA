  export const cleanPhoneNumber = (phone) => {
    if (!phone) return "";
    
    let cleaned = phone
      .trim()
      .replace(/[^0-9+]/g, "") // Keep only digits and +
      .replace(/^(\+?91)/, "") // Remove +91 or 91
      .replace(/^0+/, ""); // Remove leading zeros

    return cleaned;
  };