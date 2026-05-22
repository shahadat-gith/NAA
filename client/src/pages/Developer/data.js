import developer from "/developer.jpg";

export const developerInfo = {
  personalInfo: {
    name: "Shahadat Ali",
    image: developer,
    email: "dev.shahadat.offl@gmail.com",
    portfolio: "shahadat.in",
    mobile: "+91-76370-78247",
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shahadat-ali-aa04a728a/",
      icon: "fab fa-linkedin-in",
    },
    {
      label: "GitHub",
      href: "https://github.com/shahadat-gith",
      icon: "fab fa-github",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/shahadat.offl",
      icon: "fab fa-facebook-f",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/shahadat.offl/",
      icon: "fab fa-instagram",
    },
    {
      label: "Gmail",
      href: "mailto:dev.shahadat.offl@gmail.com",
      icon: "fas fa-envelope",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/917637078247",
      icon: "fab fa-whatsapp",
    },
  ],
  education: [
    {
      institution: "National Institute of Technology, Silchar",
      location: "Assam, India",
      degree: "B.Tech in Computer Science and Engineering",
      cgpa: "7.7",
      startDate: "July 2023",
      endDate: "May 2027",
    },
    {
      institution: "Jawahar Navodaya Vidyalaya, Barpeta",
      location: "Assam, India",
      qualification: "HSC",
      percentage: "92.4",
      startDate: "June 2020",
      endDate: "April 2022",
    },
    {
      institution: "Jawahar Navodaya Vidyalaya, Barpeta",
      location: "Assam, India",
      qualification: "SSC",
      percentage: "94.2",
      startDate: "July 2015",
      endDate: "June 2020",
    },
  ],

  skills: {
    languages: ["Python", "C", "C++", "JavaScript", "typescript"],
    frameworks: ["ReactJS", "NodeJS", "ExpressJS"],
    databases: ["MongoDB", "MySQL"],
    tools: ["AWS Lambda", "Render", "Redis"],
    softSkills: [
      "Leadership",
      "Event Management",
      "Public Speaking",
      "Time Management",
    ],
  },
};
