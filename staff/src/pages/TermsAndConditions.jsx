import { FileText, ShieldAlert, Scale, CheckCircle2 } from "lucide-react";
import AnimatedScreen from "../components/common/AnimatedScreen";

const TermsAndConditions = () => {
  const lastReviewedDate = "June 2026";

  const legalRegistry = [
    {
      title: "1. Authorized Workspace Account Usage",
      directives: [
        "Staff portal accounts are explicitly assigned to validated institutional personnel. Sharing authentication strings or cross-logging active sessions on unauthorized external devices is strictly forbidden.",
        "Personnel are solely responsible for all programmatic transactions, roster modifications, or attendance logs processed under their assigned operational credentials."
      ]
    },
    {
      title: "2. Data Input Integrity & Legal Compliance",
      directives: [
        "Any administrative entry, grading matrix, or student roster updates performed on this platform must reflect accurate, cross-verified academic ground truth.",
        "Deliberate entry falsification, unauthorized ledger manipulations, or tampering with historical telemetry logs will result in immediate session suspension and subsequent disciplinary review board escalation."
      ]
    },
    {
      title: "3. System Infrastructure Security & Boundary Conditions",
      directives: [
        "Users are prohibited from attempting to bypass system endpoints, execute unauthorized network injections, or reverse-engineer portal application layers.",
        "Automated data extraction scripts, scrapers, or excessive database ping sequences targeting academy cloud clusters are restricted and flagged by systemic diagnostic monitors."
      ]
    },
    {
      title: "4. Intellectual Property & Academic Content",
      directives: [
        "All software code assets, branding visuals, curriculum files, and structural timetable templates deployed on this domain remain the exclusive property of Nashib Ali Academy.",
        "System documentation and operational matrices may not be repackaged, modified, or distributed to third-party entities without written executive authorization."
      ]
    }
  ];

  return (
    <AnimatedScreen>
      <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">

      {/* ================= MAIN VERTICAL LAYER STACK ================= */}
      <div className="space-y-5">
        
        {/* Mandatory Compliance Banner */}
        <div className="p-3.5 rounded-2xl border bg-text-primary/5 border-border flex items-start space-x-2.5 select-none">
          <ShieldAlert size={14} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-wider">
              Mandatory Compliance Notice
            </h4>
            <p className="text-[11px] font-medium text-text-secondary leading-normal">
              By interacting with this administrative network, you consent to fulfill the guidelines stipulated herein. These criteria were last updated in <span className="text-text-primary font-bold">{lastReviewedDate}</span>.
            </p>
          </div>
        </div>

        {/* Legal Sections Matrix */}
        <div className="space-y-5">
          {legalRegistry.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-[11px] font-black text-text-primary uppercase tracking-wide px-1 select-none">
                {section.title}
              </h3>
              
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3.5">
                {section.directives.map((paragraph, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2.5 text-[11px] font-medium text-text-secondary leading-normal">
                    <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5 opacity-80" />
                    <p className="break-words">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Disclaimers Card */}
        <div className="bg-background border border-border rounded-2xl p-3.5 flex items-start space-x-2.5 text-text-secondary/70 select-none">
          <FileText size={14} className="text-text-secondary/40 mt-0.5 shrink-0" />
          <p className="text-[11px] font-medium leading-normal text-text-secondary/80">
            Nashib Ali Academy preserves the operational right to update these parameters as infrastructure guidelines scale. Continued portal deployment constitutes continuous acceptance of revised metrics.
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

export default TermsAndConditions;