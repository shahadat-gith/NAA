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
  
  let cleaned = phone
    .trim()
    .replace(/[^0-9+]/g, "") // Keep only digits and +
    .replace(/^(\+91)/, "") // Remove +91 country code
    .replace(/^0+/, "");     // Remove leading zeros

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







