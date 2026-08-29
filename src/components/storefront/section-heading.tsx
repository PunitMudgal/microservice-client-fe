import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#302016] sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
