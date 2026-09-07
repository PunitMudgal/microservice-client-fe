import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";

export function StorefrontPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fffaf2] text-[#302016]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
