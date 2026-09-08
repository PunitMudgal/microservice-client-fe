"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
}

/** Lightweight scroll reveal. CSS handles the animation, IO only toggles a class. */
export function Reveal({ children, className = "", as = "div", id }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (as === "section") {
    return (
      <section id={id} ref={ref as never} className={`reveal ${className}`}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
