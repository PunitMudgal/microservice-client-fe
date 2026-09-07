import { FALLBACK_PRODUCT_IMAGES } from "@/components/storefront/catalog-utils";

interface ProductGalleryProps {
  imageUrl?: string | null;
  productName: string;
  isVeg?: boolean | null;
}

export function ProductGallery({ imageUrl, productName, isVeg }: ProductGalleryProps) {
  const image =
    imageUrl || FALLBACK_PRODUCT_IMAGES[productName.length % FALLBACK_PRODUCT_IMAGES.length];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#f8eee1] p-8 ring-1 ring-[#eadcc9]">
        <div
          aria-hidden="true"
          className="absolute size-72 rounded-full bg-[#f4b544]/25 blur-2xl"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={productName}
          className="relative max-h-full w-full object-contain drop-shadow-[0_25px_18px_rgba(86,47,14,0.17)]"
        />
        {isVeg === true && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#527032] shadow-sm">
            <span className="grid size-4 place-items-center rounded-sm border-2 border-[#527032]">
              <span className="size-1.5 rounded-full bg-[#527032]" />
            </span>
            Pure veg
          </span>
        )}
        <span className="absolute bottom-5 left-5 rounded-full bg-[#302016]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          Fresh from the kitchen
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { title: "Made fresh", hint: "Cooked to order" },
          { title: "Veg options", hint: "Clearly marked" },
          { title: "Fair prices", hint: "No surprises" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white px-3 py-3 ring-1 ring-[#eadcc9]"
          >
            <p className="text-xs font-semibold text-[#302016] sm:text-sm">{item.title}</p>
            <p className="mt-0.5 text-[11px] text-[#765f4c] sm:text-xs">{item.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
