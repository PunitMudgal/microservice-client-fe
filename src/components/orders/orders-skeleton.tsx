export function OrdersSkeleton() {
  return (
    <div className="mt-8 grid gap-3" aria-label="Loading orders">
      {[1, 2, 3].map((item) => (
        <div key={item} className="skeleton h-28 rounded-[1.5rem]" />
      ))}
    </div>
  );
}
