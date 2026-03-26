export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="h-56 animate-pulse bg-slate-200"></div>
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200"></div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200"></div>
        <div className="mt-4 h-10 w-full animate-pulse rounded-2xl bg-slate-200"></div>
      </div>
    </div>
  );
}
