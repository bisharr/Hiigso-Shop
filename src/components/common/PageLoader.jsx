export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        <p className="text-sm font-medium text-slate-600">{text}</p>
      </div>
    </div>
  );
}
