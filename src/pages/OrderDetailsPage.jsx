import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import { buildCustomerOrderWhatsappMessage, getMyOrderById } from "../lib/db";
import { formatCurrency, formatPaymentMethod } from "../lib/format";

const WHATSAPP_NUMBER = "252907759273";

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

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadOrder() {
    setLoading(true);

    const { data, error } = await getMyOrderById(orderId);

    if (error || !data) {
      toast.error(error?.message || "Failed to load order.");
      setOrder(null);
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return <PageLoader text="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Order not found"
          message="We could not find that order."
          action={
            <Link
              to="/account/orders"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Back to My Orders
            </Link>
          }
        />
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildCustomerOrderWhatsappMessage(order)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mt-6 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {order.order_number}
            </h1>
            <p className="mt-2 text-slate-500">
              Created: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
            >
              {order.status}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(order.payment_status)}`}
            >
              Payment: {order.payment_status}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-900">Customer Details</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Full Name:</span>{" "}
                {order.contact_name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Phone:</span>{" "}
                {order.contact_phone || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Email:</span>{" "}
                {order.contact_email || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Address:</span>{" "}
                {order.delivery_address || "Pickup / No address"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-900">Order Details</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Branch:</span>{" "}
                {order.branches?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">City:</span>{" "}
                {order.branches?.city || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">
                  Fulfillment:
                </span>{" "}
                {order.fulfillment_method}
              </p>
              <p>
                <span className="font-semibold text-slate-800">
                  Payment Method:
                </span>{" "}
                {formatPaymentMethod(order.payment_method)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <h2 className="font-bold text-slate-900">Amounts</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Subtotal:</span>{" "}
                {formatCurrency(order.subtotal)}
              </p>
              <p>
                <span className="font-semibold text-slate-800">
                  Delivery Fee:
                </span>{" "}
                {formatCurrency(order.delivery_fee)}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Discount:</span>{" "}
                {formatCurrency(order.discount_amount)}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Total:</span>{" "}
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-900">Order Items</h2>

          <div className="mt-4 space-y-3">
            {(order.order_items || []).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    SKU: {item.product_sku}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>Qty: {item.quantity}</span>
                  <span>Unit: {formatCurrency(item.unit_price)}</span>
                  <span className="font-semibold text-slate-900">
                    Total: {formatCurrency(item.line_total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
            Contact on WhatsApp
          </a>

          <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700">
            <HiOutlineCheckBadge className="h-5 w-5" />
            Track My Order
          </div>
        </div>
      </div>
    </div>
  );
}
