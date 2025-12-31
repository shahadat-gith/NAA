
  
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

