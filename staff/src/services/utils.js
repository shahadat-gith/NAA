import { Command, FileText, CalendarCheck, Clock, Settings } from "lucide-react";

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

  let cleaned = phone.replace(/\D/g, "");

  // Remove country code only if number is 12 digits long
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  }

  // Remove leading zero for 11-digit numbers like 09876543210
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
};



export const ROOT_PATHS =  ["/", "/attendance", "/timetable", "/settings"];

export const getHeaderTitle = (pathname) => {
  if (pathname === "/") return "Dashboard";
  if (pathname.includes("/profile")) return "Account Details";
  if (pathname.includes("/attendance")) return "Attendance";
  if (pathname.includes("/timetable/update")) return "Update Timetable";
  if (pathname.includes("/timetable")) return "Timetable";
  if (pathname.includes("/settings")) return "Settings";
  if (pathname.includes("/developer")) return "Developer Info";
  if (pathname.includes("/academic-rules")) return "Academic Rules";
  if (pathname.includes("/terms-conditions")) return "Terms & Conditions";
  if (pathname.includes("/privacy-policy")) return "Privacy Policy";

  return "Staff Portal";
};

/**
 * Generates the staff-only global search registry database schema.
 * @param {Function} navigate - React Router DOM navigate method reference instance.
 */
export const getSearchableRegistry = (navigate) => [
  { 
    label: "Dashboard Overview", 
    keywords: ["home", "main", "overview"], 
    icon: Command, 
    action: () => navigate("/") 
  },
  { 
    label: "My Profile Details", 
    keywords: ["profile", "me", "identity"], 
    icon: FileText, 
    action: () => navigate("/profile") 
  },
  { 
    label: "Staff Attendance Roster", 
    keywords: ["attendance", "present", "scan qr"], 
    icon: CalendarCheck, 
    action: () => navigate("/attendance") 
  },
  { 
    label: "My Teaching Timetable", 
    keywords: ["timetable", "schedule", "routine"], 
    icon: Clock, 
    action: () => navigate("/timetable") 
  },
  { 
    label: "Modify Lecture Routine", 
    keywords: ["update timetable", "edit routine"], 
    icon: Clock, 
    action: () => navigate("/timetable/update") 
  },
  { 
    label: "Portal Configuration Settings", 
    keywords: ["settings", "preferences", "security"], 
    icon: Settings, 
    action: () => navigate("/settings") 
  },
];







