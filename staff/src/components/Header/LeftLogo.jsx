import { ChevronLeft } from "lucide-react";

const LeftLogo = ({ isRootPath, onBackAction }) => {
  return (
    <div className="w-12 flex items-center justify-start">
      {isRootPath ? (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-background border-border shadow-3xs">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
        </div>
      ) : (
        <button
          type="button"
          onClick={onBackAction}
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-background text-text-primary hover:text-primary active:scale-90 transition-transform cursor-pointer outline-none"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default LeftLogo;