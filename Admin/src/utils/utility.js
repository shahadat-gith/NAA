
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



