import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[var(--radius)] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[#1a3d2f]",
    secondary: "bg-[var(--foreground)] text-white hover:bg-[#2a302d]",
    outline:
      "border border-[var(--border-strong)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)]/5",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)]/5",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
