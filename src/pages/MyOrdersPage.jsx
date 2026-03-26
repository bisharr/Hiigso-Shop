import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { formatCurrency } from "../lib/format";
import { getMyOrders } from "../lib/db";

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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="No orders yet"
          message="You have not placed any orders yet. Once you checkout, your orders will appear here."
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
          Track all your orders and branch details here.
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
                <p className="text-sm text-slate-500">Order Number</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {order.order_number}
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Payment</p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {order.payment_status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Fulfillment</p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {order.fulfillment_method}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Branch</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {order.branches?.name || "Branch"}
                      {order.branches?.city ? ` • ${order.branches.city}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(order.total_amount)}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
