import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { deleteProduct, getAdminProducts } from "../../lib/db";
import { formatCurrency } from "../../lib/format";

function getPrimaryImage(product) {
  if (!product?.product_images?.length) return null;

  const primary =
    product.product_images.find((img) => img.is_primary) ||
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  return primary?.image_url || null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState("");

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await getAdminProducts();

    if (error) {
      toast.error(error.message || "Failed to load products.");
      setProducts([]);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    setDeletingId(productId);

    const { error } = await deleteProduct(productId);

    if (error) {
      toast.error(error.message || "Failed to delete product.");
    } else {
      toast.success("Product deleted.");
      await loadProducts();
    }

    setDeletingId("");
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.sku?.toLowerCase().includes(q) ||
          item?.brands?.name?.toLowerCase().includes(q) ||
          item?.categories?.name?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [products, search, statusFilter]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Products"
        subtitle="Create, edit, search, and organize your ecommerce products."
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center bg-blue-600 rounded-2xl  px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Create First Product
          </Link>
        }
      />

      <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by product name, brand, category, slug, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader text="Loading products..." />
      ) : !filteredProducts.length ? (
        <EmptyState
          title="No products found"
          message="There are no products matching your current filters."
          action={
            <Link
              to="/admin/products/new"
              className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Create First Product
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5">
          {filteredProducts.map((product) => {
            const imageUrl = getPrimaryImage(product);

            return (
              <div
                key={product.id}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-5 lg:flex-row">
                  <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-100 lg:w-36">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-slate-900">
                            {product.name}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.status === "active"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : product.status === "draft"
                                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                                  : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                            }`}
                          >
                            {product.status}
                          </span>

                          {product.is_featured && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          SKU: {product.sku} • Slug: {product.slug}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                          <span>
                            Category: {product.categories?.name || "N/A"}
                          </span>
                          <span>Brand: {product.brands?.name || "N/A"}</span>
                          <span>Price: {formatCurrency(product.price)}</span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                          {product.short_description ||
                            product.description ||
                            "No description available."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="rounded-2xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
