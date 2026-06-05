const Loader = ({ size = "medium", fullScreen = false }) => {
  const sizeClasses = {
    small: "h-5 w-5 stroke-[4px]",
    medium: "h-10 w-10 stroke-[3px]",
    large: "h-16 w-16 stroke-[2px]",
  };

  const containerClasses = fullScreen
    ? "flex min-h-screen w-full items-center justify-center bg-background transition-colors duration-200"
    : "flex w-full items-center justify-center py-6";

  return (
    <div className={containerClasses}>
      <svg
        className={`animate-spin text-primary ${sizeClasses[size]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Loader;