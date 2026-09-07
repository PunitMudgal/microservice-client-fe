import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#eadcc9] sm:p-14">
      <div
        aria-hidden="true"
        className="mx-auto grid size-16 place-items-center rounded-full bg-[#f8eee1] text-2xl"
      >
        🍽️
      </div>
      <p className="mt-5 text-lg font-semibold text-[#302016]">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#765f4c]">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#e2552d] px-6 text-sm font-semibold text-white transition hover:bg-[#c94824]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
