import { Link } from "react-router-dom";
import { HiOutlineStar, HiOutlineShoppingBag } from "react-icons/hi2";
import { formatCurrency } from "../../lib/format";

function getPrimaryImage(product) {
  if (!product?.product_images?.length) return null;

  const primary =
    product.product_images.find((image) => image.is_primary) ||
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  return primary?.image_url || null;
}

export default function ProductCard({ product }) {
  const imageUrl = getPrimaryImage(product);

  return (
    <div className="group overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/shop/${product.slug}`} className="block">
        <div className="relative h-60 overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
              No Image
            </div>
          )}

          {product.is_featured && (
            <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {product?.brands?.name || "Brand"}
          </span>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
            <HiOutlineStar className="h-4 w-4" />
            {product.rating_average || 0} ({product.rating_count || 0})
          </span>
        </div>

        <Link to={`/shop/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.short_description ||
            product.description ||
            "No description available."}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </p>

            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <p className="text-sm text-slate-400 line-through">
                  {formatCurrency(product.compare_at_price)}
                </p>
              )}
          </div>

          <Link
            to={`/shop/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-yellow-50 transition hover:bg-blue-900"
          >
            <HiOutlineShoppingBag className="h-4 w-4" />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
