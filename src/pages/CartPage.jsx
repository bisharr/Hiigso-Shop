import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import CartBranchGroup from "../components/cart/CartBranchGroup";
import CartSummaryCard from "../components/cart/CartSummaryCard";
import {
  getCartBranchCount,
  getMyCartItems,
  groupCartItemsByBranch,
  removeCartItem,
  updateCartItemQuantity,
} from "../lib/db";
import { useAuth } from "../contexts/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    if (!user) {
      setLoading(false);
      return;
    }
    loadCart();
  }, [user]);

  const groupedItems = useMemo(() => groupCartItemsByBranch(items), [items]);
  const branchCount = useMemo(() => getCartBranchCount(items), [items]);

  async function handleIncrease(item) {
    setBusyId(item.id);

    const { error } = await updateCartItemQuantity(
      item.id,
      Number(item.quantity) + 1,
    );

    if (error) {
      toast.error(error.message || "Failed to update quantity.");
    } else {
      await loadCart();
    }

    setBusyId("");
  }

  async function handleDecrease(item) {
    if (Number(item.quantity) <= 1) {
      return handleRemove(item);
    }

    setBusyId(item.id);

    const { error } = await updateCartItemQuantity(
      item.id,
      Number(item.quantity) - 1,
    );

    if (error) {
      toast.error(error.message || "Failed to update quantity.");
    } else {
      await loadCart();
    }

    setBusyId("");
  }

  async function handleRemove(item) {
    setBusyId(item.id);

    const { error } = await removeCartItem(item.id);

    if (error) {
      toast.error(error.message || "Failed to remove item.");
    } else {
      toast.success("Item removed from cart.");
      await loadCart();
    }

    setBusyId("");
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Login required"
          message="Please login first to view your cart."
          action={
            <Link
              to="/login"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return <PageLoader text="Loading cart..." />;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          message="Add some products first before checking out."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Cart</h1>
        <p className="mt-2 text-slate-600">
          You currently have items from {branchCount} branch
          {branchCount === 1 ? "" : "es"}.
        </p>

        {branchCount > 1 && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
            Your cart contains products from multiple branches. At checkout, all
            items must use one selected branch.
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {groupedItems.map((group) => (
            <CartBranchGroup
              key={group.branch_id || group.branch_name}
              group={group}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              busyId={busyId}
            />
          ))}
        </div>

        <div className="space-y-5">
          <CartSummaryCard items={items} />

          <button
            onClick={() => navigate("/shop")}
            className="w-full rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
