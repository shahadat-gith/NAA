import { CLASS_OPTIONS } from "./academicOptions";





export const formatDate = (date) => {
  const d = new Date(date);

  const day = d.getDate();
  const year = d.getFullYear();
  const month = d.toLocaleString("en-IN", { month: "long" });

  // Function to get ordinal suffix
  const getSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${getSuffix(day)} ${month} ${year}`;
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



export const normaliseStudent = (data) => ({
  // core fields (editable)
  name: data.name ? data.name.toLowerCase() : undefined,
  fatherName: data.fatherName ? data.fatherName.toLowerCase() : undefined,
  motherName: data.motherName ? data.motherName.toLowerCase() : undefined,
  registrationNo: data.registrationNo || undefined,

  // personal (optional)
  dob: data.dob || undefined,
  gender: data.gender ? data.gender.toLowerCase() : undefined,
  phone: data.phone || undefined,
  aadhar: data.aadhar || undefined,
  pen: data.pen || undefined,

  // academic
  class: data.class || undefined,
  medium: data.medium ? data.medium.toLowerCase() : undefined,
  stream: data.stream ? data.stream.toLowerCase() : undefined,

  // address (fully optional)
  address: {
    village: data.village ? data.village.toLowerCase() : undefined,
    postOffice: data.postOffice ? data.postOffice.toLowerCase() : undefined,
    policeStation: data.policeStation ? data.policeStation.toLowerCase() : undefined,
    district: data.district ? data.district.toLowerCase() : undefined,
    state: data.state ? data.state.toLowerCase() : undefined,
    pincode: data.pincode || undefined,
  },
});




const MEDIUM_ORDER = Object.keys(CLASS_OPTIONS);

export function sortStudents(students = []) {
  return [...students].sort((a, b) => {
    const ma = a.medium || "";
    const mb = b.medium || "";

    if (ma !== mb) {
      const ia = MEDIUM_ORDER.indexOf(ma);
      const ib = MEDIUM_ORDER.indexOf(mb);
      return ia - ib;
    }

    // same medium, sort by class order
    const order = CLASS_OPTIONS[ma] || [];
    const ca = order.indexOf(a.class);
    const cb = order.indexOf(b.class);
    if (ca !== cb) return ca - cb;

    // if classes also match, fall back to registration number
    const ra = a.registrationNo || "";
    const rb = b.registrationNo || "";
    // try numeric comparison if both are numbers
    const na = parseInt(ra, 10);
    const nb = parseInt(rb, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return ra.localeCompare(rb);
  });
}




