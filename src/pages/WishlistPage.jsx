import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import ProductGrid from "../components/storefront/ProductGrid";
import { getMyWishlistItems, removeFromWishlistByProduct } from "../lib/db";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadWishlist() {
    setLoading(true);
    const { data, error } = await getMyWishlistItems();

    if (error) {
      toast.error(error.message || "Failed to load wishlist.");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function handleRemove(productId) {
    const { error } = await removeFromWishlistByProduct(productId);

    if (error) {
      toast.error(error.message || "Failed to remove wishlist item.");
      return;
    }

    toast.success("Removed from wishlist.");
    loadWishlist();
  }

  if (loading) {
    return <PageLoader text="Loading your wishlist..." />;
  }

  const products = items.map((item) => item.products).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
          <p className="mt-2 text-slate-600">
            Save products you like and come back to them later.
          </p>
        </div>

        <Link
          to="/shop"
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Continue Shopping
        </Link>
      </div>

      {!products.length ? (
        <EmptyState
          title="Your wishlist is empty"
          message="You have not saved any products yet."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Browse Products
            </Link>
          }
        />
      ) : (
        <>
          <ProductGrid products={products} loading={false} />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleRemove(item.product_id)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Remove {item.products?.name || "Item"} from wishlist
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
