export default function BranchStockList({ inventory = [] }) {
  if (!inventory.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">
          Branch Availability
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          No branch stock information available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Branch Availability</h3>

      <div className="mt-4 space-y-3">
        {inventory.map((item) => {
          const available = item.is_available && item.stock_quantity > 0;

          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {item?.branches?.name || "Branch"}
                </p>
                <p className="text-sm text-slate-500">
                  {item?.branches?.city || "City"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    available
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-red-50 text-red-700 ring-1 ring-red-100"
                  }`}
                >
                  {available ? "In Stock" : "Out of Stock"}
                </span>

                <span className="text-sm font-medium text-slate-600">
                  Qty: {item.stock_quantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
