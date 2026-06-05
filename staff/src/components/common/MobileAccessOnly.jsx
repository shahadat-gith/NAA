import { Smartphone, Monitor, ShieldAlert } from "lucide-react";

const MobileAccessOnly = () => {
  return (
    <div className="hidden sm:flex fixed inset-0 bg-background text-text-primary flex-col items-center justify-center p-6 select-none text-center animate-fade-in">
      <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        
        {/* Animated Graphic Status Indicators */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />
          <Monitor className="w-10 h-10 text-text-secondary opacity-40 absolute" />
          <Smartphone 
            className="w-10 h-10 text-primary z-10 animate-bounce" 
            style={{ animationDuration: '2s' }} 
          />
          <ShieldAlert className="w-5 h-5 text-danger absolute -top-1 -right-1 z-20" />
        </div>

        {/* Messaging Layout */}
        <h1 className="text-xl font-black tracking-tight text-text-primary">
          Mobile Access Only
        </h1>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
          Nashib Ali Academy • Staff Portal
        </p>
        
        <div className="w-full border-t border-border/60 my-4" />

        {/* Descriptive User Alert */}
        <p className="text-xs font-medium text-text-secondary leading-relaxed">
         This portal is designed to be viewed on mobile phones only. Please open this site on any Android or iOS device!
        </p>        
      </div>
    </div>
  );
};

export default MobileAccessOnly;