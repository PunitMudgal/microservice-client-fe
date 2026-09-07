import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-[#c9b69f]">
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-[#765f4c] transition-colors hover:text-[#302016]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "font-semibold text-[#302016]" : "text-[#765f4c]"}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
