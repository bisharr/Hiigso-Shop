import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { getMyOrders } from "../lib/db";
import { formatCurrency, formatPaymentMethod } from "../lib/format";

function getStatusClass(status) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "cancelled":
      return "bg-red-50 text-red-700 ring-1 ring-red-100";
    case "processing":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await getMyOrders();

    if (error) {
      toast.error(error.message || "Failed to load orders.");
      setOrders([]);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <PageLoader text="Loading your orders..." />;
  }

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="No orders yet"
          message="You have not placed any orders yet."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-2 text-slate-600">
          Review your order history and track order progress.
        </p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {order.order_number}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-slate-500">Branch</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {order.branches?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Payment</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatPaymentMethod(order.payment_method)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
