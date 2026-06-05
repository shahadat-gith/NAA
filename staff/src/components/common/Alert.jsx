import { CheckCircle2, AlertCircle, XCircle, Info } from "lucide-react";
import Button from "./Button";

const Alert = ({
  visible,
  title,
  message,
  variant = "info", // info, success, warning, danger
  buttons = [],     // Array of button objects: { text: "OK", onClick: () => {}, variant: "accent" }
  onClose,
}) => {
  if (!visible) return null;

  // 1. Icon configuration mapping
  const iconMap = {
    info: <Info size={28} className="text-primary" />,
    success: <CheckCircle2 size={28} className="text-success" />,
    danger: <XCircle size={28} className="text-danger" />,
    warning: <AlertCircle size={28} className="text-amber-500" />,
  };

  // 2. Fallback execution helper to close modal cleanly
  const handleButtonAction = (callback) => {
    if (callback) callback();
    if (onClose) onClose();
  };

  // 3. Render default platform fallback controls if no explicit action mapping array is passed
  const renderedButtons = buttons.length > 0 ? buttons : [
    { text: "OK", variant: "outline", onClick: onClose }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-fade-in">
      {/* Dimmed Backdrop overlay closer handler block */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose} 
      />

      {/* Mobile-Inspired Web Dialog Structure */}
      <div className="w-full max-w-sm rounded-3xl p-6 border bg-card border-border shadow-2xl transition-all duration-300 scale-in flex flex-col items-center text-center">
        
        {/* Centered Graphic Status Circle Frame */}
        <div className="mb-4 w-14 h-14 rounded-2xl bg-background border border-border/60 flex items-center justify-center shadow-xs">
          {iconMap[variant]}
        </div>

        {/* Text Presentation Content Container Layers */}
        <div className="w-full mb-6 space-y-1.5">
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            {title}
          </h3>
          {message && (
            <p className="text-xs sm:text-sm font-medium text-text-secondary leading-relaxed px-2">
              {message}
            </p>
          )}
        </div>

        {/* Action Options Control Grid - Stacked naturally like system alerts */}
        <div className="w-full space-y-2">
          {renderedButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.variant || "accent"}
              size="md"
              fullWidth
              onClick={() => handleButtonAction(btn.onClick)}
            >
              {btn.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alert;