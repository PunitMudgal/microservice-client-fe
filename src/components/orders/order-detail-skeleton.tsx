export function OrderDetailSkeleton() {
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-6 py-10 sm:px-10">
      <div className="skeleton h-6 w-32 rounded-full" />
      <div className="skeleton h-12 w-2/3 rounded-2xl" />
      <div className="skeleton h-64 rounded-[1.75rem]" />
      <div className="skeleton h-40 rounded-[1.75rem]" />
    </main>
  );
}
