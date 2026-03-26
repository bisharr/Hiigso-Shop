import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import CartItemCard from "../components/storefront/CartItemCard";
import CartSummaryCard from "../components/storefront/CartSummaryCard";
import {
  getMyCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../lib/db";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  async function loadCart() {
    setLoading(true);
    const { data, error } = await getMyCartItems();

    if (error) {
      toast.error(error.message || "Failed to load cart.");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleIncrease(item) {
    setBusyId(item.id);

    const { error } = await updateCartItemQuantity(item.id, item.quantity + 1);

    if (error) {
      toast.error(error.message || "Failed to update quantity.");
    } else {
      await loadCart();
    }

    setBusyId("");
  }

  async function handleDecrease(item) {
    setBusyId(item.id);

    if (item.quantity <= 1) {
      const { error } = await removeCartItem(item.id);
      if (error) {
        toast.error(error.message || "Failed to remove item.");
      } else {
        toast.success("Item removed.");
        await loadCart();
      }
      setBusyId("");
      return;
    }

    const { error } = await updateCartItemQuantity(item.id, item.quantity - 1);

    if (error) {
      toast.error(error.message || "Failed to update quantity.");
    } else {
      await loadCart();
    }

    setBusyId("");
  }

  async function handleRemove(itemId) {
    setBusyId(itemId);

    const { error } = await removeCartItem(itemId);

    if (error) {
      toast.error(error.message || "Failed to remove item.");
    } else {
      toast.success("Item removed.");
      await loadCart();
    }

    setBusyId("");
  }

  if (loading) {
    return <PageLoader text="Loading your cart..." />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
          <p className="mt-2 text-slate-600">
            Review your selected products before checkout.
          </p>
        </div>

        <Link
          to="/shop"
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
        >
          Continue Shopping
        </Link>
      </div>

      {!items.length ? (
        <EmptyState
          title="Your cart is empty"
          message="Looks like you have not added any products yet."
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
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="space-y-5">
            <CartSummaryCard items={items} />

            <Link
              to="/checkout"
              className="block rounded-2xl bg-blue-600 px-5 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
