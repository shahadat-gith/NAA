import { 
  BookOpen, 
  FileSpreadsheet, 
  Scale, 
  ShieldCheck, 
  Users, 
  Clock 
} from "lucide-react";
import AnimatedScreen from "../components/common/AnimatedScreen";

const AcademicRules = () => {

  const rulesRegistry = [
    {
      category: "Instructional Delivery Standards",
      icon: BookOpen,
      directives: [
        {
          title: "Syllabus Compliance & Tracking",
          description: "All instructors must map classroom progression against the authorized semester lesson matrix. Weekly lecture logs must be filed via telemetry trackers before Saturday evening."
        },
        {
          title: "Lecture Timeliness Protocol",
          description: "Instructors must report to designated lecture spaces within 5 minutes of class commencement. Any emergency room swap or proxy assignment requires Dean authorization."
        }
      ]
    },
    {
      category: "Examination & Evaluation Duties",
      icon: FileSpreadsheet,
      directives: [
        {
          title: "Invigilation Accountability",
          description: "Assigned invigilators must report to the examination distribution desk 20 minutes before session commencement. Unauthorized room absences during testing cycles are strictly forbidden."
        },
        {
          title: "Script Grading Deadlines",
          description: "Evaluated answer sheets and absolute grading matrices must be locked into the secure faculty spreadsheet ledger within 7 working days from the examination date."
        }
      ]
    },
    {
      category: "Attendance Audit Thresholds",
      icon: Clock,
      directives: [
        {
          title: "Minimum Roster Verification",
          description: "Staff must strictly flag students falling underneath the mandatory 75% structural lecture attendance threshold. No manual retrofitting of attendance markers is permitted."
        },
        {
          title: "Real-time Verification",
          description: "Classroom attendance logs must be captured in real-time or securely updated via the authorized roster scanners. Delayed entry generation is discouraged to ensure cross-verification integrity."
        }
      ]
    },
    {
      category: "Professional Code & Integrity",
      icon: ShieldCheck,
      directives: [
        {
          title: "Academic Honor System",
          description: "Maintaining strict anti-plagiarism guardrails for project reviews and internal assignments. Staff must immediately report any malpractice occurrences to the academic review council."
        },
        {
          title: "Workspace Disciplinary Policy",
          description: "Staff are expected to enforce respectful operational decorum within the laboratory spaces, classrooms, and lecture halls, escalating consistent compliance breaks immediately."
        }
      ]
    }
  ];

  return (
    <AnimatedScreen>
       <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">

      {/* ================= VERTICAL MOBILE STACK CONTENT ================= */}
      <div className="space-y-5">
        {rulesRegistry.map((section, idx) => {
          const SectionIcon = section.icon;
          return (
            <div key={idx} className="space-y-1.5">
              
              {/* Category Subheading Row */}
              <div className="flex items-center space-x-1.5 text-text-secondary px-1 select-none">
                <SectionIcon size={12} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">
                  {section.category}
                </h3>
              </div>

              {/* Directives Content Card Matrix */}
              <div className="bg-card border border-border rounded-2xl divide-y divide-border/40 shadow-xs overflow-hidden">
                {section.directives.map((rule, ruleIdx) => (
                  <div key={ruleIdx} className="p-4 flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-black text-text-primary tracking-tight">
                        {rule.title}
                      </h4>
                      <p className="text-[11px] font-medium text-text-secondary leading-normal">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })}

        {/* Footer Declaration Notice Segment */}
        <div className="bg-background border border-border rounded-2xl p-3.5 flex items-start space-x-2.5 text-text-secondary/70 select-none">
          <Users size={14} className="text-text-secondary/40 mt-0.5 shrink-0" />
          <p className="text-[11px] font-medium leading-normal text-text-secondary/80">
            These rules form the foundation of operational parameters at Nashib Ali Academy. Any structural variations or exceptions require authorized review by institutional board members.
          </p>
        </div>

        {/* Copyright Footnotes Label */}
        <p className="text-[9px] font-black text-text-secondary/40 text-center pt-2 uppercase tracking-widest select-none">
          Nashib Ali Academy &bull; &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </main>
    </AnimatedScreen>
   
  );
};

export default AcademicRules;