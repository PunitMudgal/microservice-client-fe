import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#302016] text-[#f1e4d5]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[#f4b544]"
      />
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-2xl font-bold tracking-tighter text-white"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#f4b544] text-sm">
                N
              </span>
              nesta
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Good food, better company. Freshly made favourites, generous
              plates, and a little extra joy in every bite.
            </p>
            <a
              href="mailto:hello@nesta.food"
              aria-label="Email Nesta"
              className="mt-7 grid size-10 place-items-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#f4b544] hover:text-[#382411]"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="size-4"
                aria-hidden="true"
              />
            </a>
          </div>
          <nav aria-label="Explore">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b544]">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="#menu"
                  className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#story"
                  className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]"
                >
                  Our story
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b544]">
              Say hello
            </p>
            <a
              href="mailto:hello@nesta.food"
              className="mt-5 flex items-center gap-3 text-sm text-white/70 transition-colors duration-300 hover:text-[#f4b544]"
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="size-4 text-[#f4b544]"
                aria-hidden="true"
              />
              hello@nesta.food
            </a>
            <p className="mt-3 text-sm text-white/45">
              Made fresh for your table, every day.
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Nesta. Good food, better company.</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="transition-colors duration-300 hover:text-[#f4b544]"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="transition-colors duration-300 hover:text-[#f4b544]"
            >
              Terms
            </a>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-9 place-items-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#f4b544] hover:text-[#382411]"
            >
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                strokeWidth={2}
                className="size-4"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
