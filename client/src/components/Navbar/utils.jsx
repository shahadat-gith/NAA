export const pages = [
  { name: 'Home', path: '/', desc: 'Home page & school overview', icon: <i className="fas fa-home"></i> },

  { name: 'About', path: '/about', desc: 'Our story, mission & leadership team', icon: <i className="fas fa-info-circle"></i> },

  { name: 'Student Portal', path: '/student', desc: 'Access grades, schedules & resources', icon: <i className="fas fa-user-graduate"></i> },

  { name: 'Academics', path: '/academics', desc: 'Programs, departments & academic calendar', icon: <i className="fas fa-book"></i> },

  { name: 'Curriculum', path: '/curriculum?type=kinder', desc: 'Kindergarten & grade-level course guides', icon: <i className="fas fa-book-open"></i> },

  { name: 'Teachers', path: '/teachers', desc: 'Meet our faculty & staff directory', icon: <i className="fas fa-chalkboard-teacher"></i> },

  { name: 'Gallery', path: '/gallery', desc: 'Photos & memories from school events', icon: <i className="fas fa-image"></i> },

  { name: 'Contact', path: '/contact', desc: 'Get in touch with us anytime', icon: <i className="fas fa-envelope"></i> },

  { name: 'Admission', path: '/admission', desc: 'Apply now & enrollment information', icon: <i className="fas fa-file-alt"></i> },

  { name: 'Result', path: '/result', desc: 'Check exam results & performance reports', icon: <i className="fas fa-chart-bar"></i> },
  { name: 'Notices', path: '/notices', desc: 'Check latest updates and notices', icon: <i className="fas fa-bullhorn"></i> },
];


export function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="sb-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}



  export const navGroups = [
    {
      title: "Academics",
      items: [
        { label: "Overview", to: "/academics" },
        { label: "Curriculum", to: "/curriculum?type=kinder" },
        { label: "Teachers", to: "/teachers" },
      ],
    },
    {
      title: "Students",
      items: [
        { label: "Student Portal", to: "/student" },
        { label: "Results", to: "/result" },
      ],
    },
    {
      title: "Explore",
      items: [
        { label: "Gallery", to: "/gallery" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
      ],
    },
  ];

