export function ProductSkeleton() {
  return (
    <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:py-14">
      <div className="skeleton aspect-square rounded-[2.5rem]" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-12 w-3/4 rounded-2xl" />
        <div className="skeleton h-20 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="skeleton h-14 rounded-2xl" />
          <div className="skeleton h-14 rounded-2xl" />
        </div>
        <div className="skeleton h-24 w-full rounded-[1.75rem]" />
      </div>
    </section>
  );
}
