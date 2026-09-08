import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

/** Shared Nesta Foods logo. Single source so header/footer stay in sync. */
export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/nesta_logo.png"
      alt="Nesta Foods"
      width={607}
      height={371}
      priority={priority}
      sizes="(max-width: 640px) 140px, 180px"
      className={cn("h-9 w-auto object-contain sm:h-10", className)}
    />
  );
}
