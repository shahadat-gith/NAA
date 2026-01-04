
  export const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};



export const formatAddress = (address) => {
  if (!address) return "N/A";

  const {
    village,
    postOffice,
    policeStation,
    district,
    state,
    pincode,
  } = address;

  return [
    village,
    postOffice,
    policeStation,
    district,
    state,
    pincode,
  ]
    .filter(Boolean)
    .join(", ");
};


export const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};


export const capitalizeWords = (text = "") =>
  text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

export const capitalizeFirst = (text = "") =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "-";



