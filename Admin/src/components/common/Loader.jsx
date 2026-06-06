import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-12 h-12 mb-5">
          <div className="absolute inset-0 border-4 border-[var(--border-default)] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>

        {/* Text */}
        <span className="text-[var(--text-primary)] font-semibold text-base tracking-wide">
          {text}
        </span>

        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default Loader;