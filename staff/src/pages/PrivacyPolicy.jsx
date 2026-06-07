import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";
import AnimatedScreen from "../components/common/AnimatedScreen";

const PrivacyPolicy = () => {
  const securityEncryptionStandard = "AES-256";

  const policyRegistry = [
    {
      title: "1. Data Collection & Perimeter Boundaries",
      directives: [
        "We collect fundamental personnel infrastructure profile datasets necessary for core portal operations, including full name, institutional email aliases, profile images, and system-generated Staff IDs.",
        "Programmatic activity tracking parameters—such as historical login records, IP access footprints, and roster modification logs—are automatically recorded by diagnostic monitors to preserve security integrity."
      ]
    },
    {
      title: "2. Data Utilization Protocols",
      directives: [
        "Collected information is deployed exclusively to maintain secure authentication tokens, verify digital identity configurations, populate scheduling matrices, and track roster attendance histories.",
        "Your metrics are never compiled for commercial distribution, monetization, tracking pixels, or third-party marketing brokers."
      ]
    },
    {
      title: "3. Cryptographic Storage & Infrastructure Preservation",
      directives: [
        `All active database repositories, password strings, and sensitive profile records are protected using industry-standard ${securityEncryptionStandard} encryption protocols during transit and storage cycles.`,
        "Image assets and cropped avatar blobs are safely managed inside sandboxed cloud storage instances with secure token authentication keys required for target image retrieval."
      ]
    },
    {
      title: "4. Information Disclosure & Retention Window",
      directives: [
        "Staff profile records are retained for the active duration of institutional employment. Upon workspace termination, account access is immediately locked, and data blocks are archived in accordance with academy compliance rules.",
        "Data access is restricted to verified administrative supervisors and system engineers. Information will only be disclosed externally if explicitly required by local compliance or institutional safety mandates."
      ]
    }
  ];

  return (
   <AnimatedScreen>
     <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">
      

      {/* ================= VERTICAL MOBILE CONTENT LAYOUT ================= */}
      <div className="space-y-5">
        
        {/* Security Highlight Banner Card */}
        <div className="p-3.5 rounded-2xl border bg-success/5 border-success/20 flex items-start space-x-2.5 select-none">
          <Lock size={14} className="text-success shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-wider">
              Secure Data Encryption Guaranteed
            </h4>
            <p className="text-[11px] font-medium text-text-secondary leading-normal">
              This administrative interface enforces strict hardware and network-level partitioning strategies. All cloud database connections operate behind end-to-end socket level firewalls.
            </p>
          </div>
        </div>

        {/* Policy Sections Matrix */}
        <div className="space-y-5">
          {policyRegistry.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-[11px] font-black text-text-primary uppercase tracking-wide px-1 select-none">
                {section.title}
              </h3>
              
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3.5">
                {section.directives.map((paragraph, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2.5 text-[11px] font-medium text-text-secondary leading-normal">
                    <EyeOff size={13} className="text-primary shrink-0 mt-0.5 opacity-80" />
                    <p className="break-words">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Compliance Disclaimers */}
        <div className="bg-background border border-border rounded-2xl p-3.5 flex items-start space-x-2.5 text-text-secondary/70 select-none">
          <Database size={14} className="text-text-secondary/40 mt-0.5 shrink-0" />
          <p className="text-[11px] font-medium leading-normal text-text-secondary/80">
            Privacy guidelines match global data protection frameworks for educational systems. For technical telemetry inquiries, reach out directly via your administrative helpdesk.
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

export default PrivacyPolicy;