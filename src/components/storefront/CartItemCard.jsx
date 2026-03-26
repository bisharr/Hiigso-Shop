import { Link } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi2";
import { formatCurrency } from "../../lib/format";

function getImage(product) {
  if (!product?.product_images?.length) return null;

  const primary =
    product.product_images.find((img) => img.is_primary) ||
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  return primary?.image_url || null;
}

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  busy = false,
}) {
  const imageUrl = getImage(item.products);
  const lineTotal = Number(item.unit_price) * Number(item.quantity);

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-32">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.products?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                to={`/shop/${item.products?.slug}`}
                className="text-lg font-bold text-slate-900 hover:text-blue-600"
              >
                {item.products?.name}
              </Link>

              <p className="mt-2 text-sm text-slate-500">
                Branch: {item.branches?.name || "Unknown"}{" "}
                {item.branches?.city ? `• ${item.branches.city}` : ""}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Unit Price: {formatCurrency(item.unit_price)}
              </p>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <HiOutlineTrash className="h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center rounded-2xl border border-slate-200">
              <button
                onClick={() => onDecrease(item)}
                disabled={busy}
                className="px-4 py-2 text-lg font-bold text-slate-700 disabled:opacity-50"
              >
                -
              </button>
              <span className="min-w-12 px-4 text-center font-semibold text-slate-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onIncrease(item)}
                disabled={busy}
                className="px-4 py-2 text-lg font-bold text-slate-700 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">Line Total</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(lineTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
