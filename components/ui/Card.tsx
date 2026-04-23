import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--card)] ${className}`}
    >
      {children}
    </div>
  );
}
