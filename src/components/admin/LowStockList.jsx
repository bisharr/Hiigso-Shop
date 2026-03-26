export default function LowStockList({ items = [] }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">Low Stock Alerts</h2>

      {!items.length ? (
        <p className="mt-4 text-sm text-slate-600">
          No low stock alerts right now.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <p className="font-semibold text-slate-900">
                {item.products?.name || "Product"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {item.branches?.name || "Branch"}{" "}
                {item.branches?.city ? `• ${item.branches.city}` : ""}
              </p>
              <p className="mt-2 text-sm text-red-600">
                Stock: {item.stock_quantity} • Threshold:{" "}
                {item.low_stock_threshold}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
