import { HiOutlineMapPin } from "react-icons/hi2";
import { formatCurrency } from "../../lib/format";

export default function CartBranchGroup({
  group,
  onIncrease,
  onDecrease,
  onRemove,
  busyId,
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 flex items-center gap-2">
        <HiOutlineMapPin className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">
          {group.branch_name}
          {group.branch_city ? ` • ${group.branch_city}` : ""}
        </h2>
      </div>

      <div className="space-y-4">
        {group.items.map((item) => {
          const image =
            item.products?.product_images?.find((img) => img.is_primary)
              ?.image_url ||
            item.products?.product_images?.[0]?.image_url ||
            "";

          return (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row"
            >
              <div className="h-24 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-28">
                {image ? (
                  <img
                    src={image}
                    alt={item.products?.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.products?.name || "Product"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      SKU: {item.products?.sku || "N/A"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatCurrency(item.unit_price)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onDecrease(item)}
                      disabled={busyId === item.id}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      -
                    </button>

                    <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => onIncrease(item)}
                      disabled={busyId === item.id}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      +
                    </button>

                    <button
                      onClick={() => onRemove(item)}
                      disabled={busyId === item.id}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Line Total</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(
                      Number(item.unit_price) * Number(item.quantity),
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
