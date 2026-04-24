import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export default function Select({ label, hint, className = "", children, ...props }: SelectProps) {
  return (
    <div className="grid gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      {hint && (
        <span className="text-xs text-[var(--muted)]">{hint}</span>
      )}
      <select
        className={`w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
