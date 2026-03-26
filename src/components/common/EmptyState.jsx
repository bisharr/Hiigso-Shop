export default function EmptyState({
  title = "No data found",
  message = "There is nothing to show right now.",
  action,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        {message}
      </p>

      {action && (
        <div className="mt-6 flex justify-center">
          <div className="inline-flex">{action}</div>
        </div>
      )}
    </div>
  );
}
