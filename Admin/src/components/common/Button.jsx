import { FaSpinner } from "react-icons/fa6";
import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {

  const baseStyles =
    'inline-flex items-center justify-center font-["Poppins",sans-serif] font-medium tracking-wide select-none transition-all duration-150 rounded-[12px] border-2 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]';

  const variants = {
    primary:
      "bg-[var(--color-primary-subtle)] border-[var(--border-strong)] text-[var(--color-primary-bright)] hover:bg-[rgba(56,139,253,0.2)] hover:border-[var(--color-primary-bright)]",
    secondary:
      "bg-transparent border-[var(--text-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] hover:border-[var(--text-primary)]",
    warning:
      "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] text-[var(--color-warning)] hover:bg-[rgba(251,191,36,0.2)]",
    danger:
      "bg-[var(--color-error-bg)] border-[var(--color-error-border)] text-[var(--color-error)] hover:bg-[rgba(248,113,113,0.2)]",
    success:
      "bg-[var(--color-success-bg)] border-[var(--color-success-border)] text-[var(--color-success)] hover:bg-[rgba(34,197,94,0.2)]",
  };

  const sizes = {
    xs: "px-[10px] py-[4px] text-[12px]",
    sm: "px-[12px] py-[6px] text-[12px]",
    md: "px-[16px] py-[9px] text-[14px]",
    lg: "px-[20px] py-[12px] text-[14px]",
  };

  const buttonStyles = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <FaSpinner
          size={15}
          className="animate-spin [animation-duration:2s] mr-2"
        />
      )}

      <span>{children}</span>
    </button>
  );
};