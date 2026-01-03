
  
  import * as XLSX from "xlsx";
  
  /* ================= EXPORT ================= */
  export const exportToExcel = (students) => {
    if (!students.length) {
      toast.error("No students to export");
      return;
    }

    const data = students.map((s) => ({
      Name: s.name,
      Class: formatClassName(s.class),
      Medium: s.medium,
      Stream: s.stream || "-",
      "Registration No": s.registrationNo || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Student_List_${date}.xlsx`);
  };


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


