import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--foreground)]/5 text-[var(--muted)] border border-[var(--border)]",
    accent:
      "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20",
    muted: "bg-[var(--foreground)]/5 text-[var(--muted-foreground)]",
    outline:
      "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
