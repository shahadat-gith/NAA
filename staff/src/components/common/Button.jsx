import Loader from "./Loader";

const Button = ({
  children,
  type = "button",
  variant = "accent", // accent, primary, danger, outline
  size = "md",        // sm, md, lg
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,         // Pass a Lucide icon component reference
  onClick,
  className = "",
  ...props
}) => {
  // 1. Structural base classes
  const baseClasses = "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 rounded-2xl border outline-none cursor-pointer select-none active:scale-[0.985] disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group";

  // 2. Sizing variations
  const sizeClasses = {
    sm: "h-10 px-4 text-xs rounded-xl",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  // 3. Color & styling variations mapped to your Tailwind v4 theme
  const variantClasses = {
    accent: "bg-accent border-transparent text-white hover:bg-accent/90 shadow-lg shadow-accent/15 disabled:bg-inactive disabled:opacity-60",
    primary: "bg-primary border-transparent text-white hover:bg-primary/90 shadow-lg shadow-primary/15 disabled:bg-inactive disabled:opacity-60",
    danger: "bg-danger border-transparent text-white hover:bg-danger/90 shadow-lg shadow-danger/15 disabled:bg-inactive disabled:opacity-60",
    outline: "bg-transparent border-border text-text-primary hover:bg-text-primary/5 disabled:text-inactive disabled:border-border",
  };

  const widthClass = fullWidth ? "w-full flex" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {/* Premium Light Sheen Hover Overlay Layer */}
      {!disabled && !loading && (
        <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}

      {/* Internal Content Alignment Wrapper */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <Loader size="small" />
        ) : (
          <>
            {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className="flex-shrink-0" />}
            <span>{children}</span>
          </>
        )}
      </div>
    </button>
  );
};

export default Button;