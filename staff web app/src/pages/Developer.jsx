import { Loader2, CloudLightning, ExternalLink } from "lucide-react";
import { useDeveloperData } from "../hooks/useDeveloperData";

const Developer = () => {
  const { developerInfo, loading, error } = useDeveloperData();

  // 1. Loading State UI Layout
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-3 text-xs sm:text-sm font-medium text-text-secondary">
          Fetching developer credentials...
        </p>
      </div>
    );
  }

  // 2. Error/Offline Fallback State UI Layout
  if (error || !developerInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4">
          <CloudLightning size={22} />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          Failed to Synchronize Profile
        </h3>
        <p className="text-xs font-medium text-text-secondary mt-1 leading-relaxed">
          Unable to resolve remote infrastructure records. Make sure your local system is connected to an active network pool.
        </p>
      </div>
    );
  }

  // Extract clean structured items out of the developer data state payload
  const { personalInfo, socialLinks, education, skills } = developerInfo;
  const fallbackImage = "/user.png";

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT ASIDE COLUMN: CARD INFRASTRUCTURE ================= */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Profile Card Summary Module */}
          <div className="bg-card border border-border rounded-3xl p-6 text-center shadow-xs flex flex-col items-center">
            <img
              src={personalInfo.image || fallbackImage}
              alt={personalInfo.name || "Developer Avatar"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary bg-background shadow-xs"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-text-primary mt-4">
              {personalInfo.name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-primary mt-1 tracking-wide uppercase">
              {personalInfo.title || "Software Engineer"}
            </p>
          </div>

          {/* SECTION: Social Channels Connections */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
              Connect with me
            </h3>
            <div className="bg-card border border-border rounded-3xl divide-y divide-border/40 overflow-hidden shadow-xs">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-transparent hover:bg-text-primary/5 transition-colors duration-150 group text-decoration-none no-underline outline-none"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight truncate">
                      {item.label}
                    </h4>
                    <p className="text-xs font-medium text-text-secondary mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="inline-flex items-center space-x-1 bg-background border border-border/60 px-2.5 py-1 rounded-lg text-primary text-[10px] font-bold uppercase tracking-wider flex-shrink-0 transition-all group-hover:border-primary/20">
                    <span>{item.actionText || "View"}</span>
                    <ExternalLink size={10} className="ml-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT MAIN COLUMN: CORE COMPREHENSIVE DOSSIER ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION: Technical Skill Blocks Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
              Skills & Expertises
            </h3>
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-5">
              {Object.entries(skills).map(([category, list], idx, arr) => (
                <div 
                  key={category} 
                  className={`space-y-2.5 ${idx !== arr.length - 1 ? "border-b border-border/40 pb-4" : ""}`}
                >
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {list.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-background border border-border/60 text-text-primary shadow-2xs hover:border-border transition-colors select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: Educational Credentials System Timelines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
              Education History
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-base font-bold text-text-primary tracking-tight">
                      {edu.institution}
                    </h4>
                    <p className="text-xs font-semibold text-text-secondary">
                      {edu.location}
                    </p>
                    <p className="text-xs font-bold text-text-primary pt-2">
                      {edu.degree}
                    </p>
                    <p className="text-[11px] font-medium text-inactive">
                      {edu.timeline}
                    </p>
                  </div>

                  <div className="bg-background border border-border/60 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs text-center min-w-[70px]">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-primary">
                      {edu.metric || "Marks"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Developer;