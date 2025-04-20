export const fetchSettings = async (backendUrl) => {
    const response = await fetch(`${backendUrl}/api/settings/settings`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch settings");
    return data.data;
  };
  
  export const searchStudents = async (backendUrl, searchTerm) => {
    const trimmedTerm = searchTerm.trim();
    const cleanTerm = trimmedTerm.replace(/\s+/g, "");
    const searchParams = {};
  
    if (/^\d+$/.test(cleanTerm)) {
      if (cleanTerm.length === 10) searchParams.phone = cleanTerm;
      else if (cleanTerm.length === 12) searchParams.aadhar = cleanTerm;
      else searchParams.rollNo = trimmedTerm;
    } else {
      searchParams.name = trimmedTerm;
    }
  
    const queryString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `${backendUrl}/api/students/search?${queryString}`;
  
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Search failed");
    if (!data.success) throw new Error("No students found");
    return data.data;
  };