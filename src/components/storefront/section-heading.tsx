import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  id?: string;
}

export function SectionHeading({ eyebrow, title, action, id }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b85625]">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="text-balance text-3xl font-bold tracking-tight text-[#302016] sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
