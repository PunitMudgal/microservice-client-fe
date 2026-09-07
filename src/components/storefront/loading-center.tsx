export function LoadingCenter({ message }: { message: string }) {
  return (
    <main className="grid min-h-[50vh] place-items-center px-6">
      <div className="flex flex-col items-center gap-3 text-sm text-[#765f4c]">
        <span
          aria-hidden="true"
          className="size-8 animate-spin rounded-full border-2 border-[#eadcc9] border-t-[#e2552d]"
        />
        <p role="status">{message}</p>
      </div>
    </main>
  );
}
