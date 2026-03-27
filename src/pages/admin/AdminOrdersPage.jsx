import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { formatCurrency, formatPaymentMethod } from "../../lib/format";
import {
  assignOrderStaff,
  getAdminOrders,
  getAdminStaffProfiles,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "../../lib/db";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

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
    case "paid":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [staffProfiles, setStaffProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busyOrderId, setBusyOrderId] = useState("");

  async function loadOrdersPage() {
    setLoading(true);

    const [
      { data: orderData, error: orderError },
      { data: staffData, error: staffError },
    ] = await Promise.all([getAdminOrders(), getAdminStaffProfiles()]);

    if (orderError) {
      console.error("Admin orders error:", orderError);
      toast.error(orderError.message || "Failed to load orders.");
    }

    if (staffError) {
      console.error("Staff profiles error:", staffError);
      toast.error(staffError.message || "Failed to load staff profiles.");
    }

    setOrders(orderData || []);
    setStaffProfiles(staffData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrdersPage();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setBusyOrderId(orderId);

    const { error } = await updateOrderStatus(orderId, newStatus);

    if (error) {
      toast.error(error.message || "Failed to update order status.");
    } else {
      toast.success("Order status updated.");
      await loadOrdersPage();
    }

    setBusyOrderId("");
  }

  async function handlePaymentStatusChange(orderId, paymentStatus) {
    setBusyOrderId(orderId);

    const { error } = await updateOrderPaymentStatus(orderId, paymentStatus);

    if (error) {
      toast.error(error.message || "Failed to update payment status.");
    } else {
      toast.success("Payment status updated.");
      await loadOrdersPage();
    }

    setBusyOrderId("");
  }

  async function handleAssignStaff(orderId, assignedStaffId) {
    setBusyOrderId(orderId);

    const { error } = await assignOrderStaff(orderId, assignedStaffId);

    if (error) {
      toast.error(error.message || "Failed to assign staff.");
    } else {
      toast.success("Order assignment updated.");
      await loadOrdersPage();
    }

    setBusyOrderId("");
  }

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (order) =>
          order.order_number?.toLowerCase().includes(q) ||
          order.contact_name?.toLowerCase().includes(q) ||
          order.contact_phone?.toLowerCase().includes(q) ||
          order.contact_email?.toLowerCase().includes(q) ||
          order.branches?.name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [orders, statusFilter, search]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Orders"
        subtitle="View full customer details, payment details, branch info, delivery address, and items."
      />

      <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order number, full name, phone, email, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader text="Loading orders..." />
      ) : !filteredOrders.length ? (
        <EmptyState
          title="No orders found"
          message="There are no orders matching your current search or filter."
        />
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {order.order_number}
                      </h2>
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

                    <p className="mt-2 text-sm text-slate-500">
                      Created: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <h3 className="text-base font-bold text-slate-900">
                      Customer Details
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">
                          Full Name:
                        </span>{" "}
                        {order.contact_name || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Phone:
                        </span>{" "}
                        {order.contact_phone || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Email:
                        </span>{" "}
                        {order.contact_email || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Address:
                        </span>{" "}
                        {order.delivery_address || "Pickup / No address"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Customer Note:
                        </span>{" "}
                        {order.customer_note || "None"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <h3 className="text-base font-bold text-slate-900">
                      Order Info
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">
                          Payment Status:
                        </span>{" "}
                        {order.payment_status}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Payment Method:
                        </span>{" "}
                        {formatPaymentMethod(order.payment_method)}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Fulfillment:
                        </span>{" "}
                        {order.fulfillment_method}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Subtotal:
                        </span>{" "}
                        {formatCurrency(order.subtotal)}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Delivery Fee:
                        </span>{" "}
                        {formatCurrency(order.delivery_fee)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <h3 className="text-base font-bold text-slate-900">
                      Branch Details
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">
                          Branch:
                        </span>{" "}
                        {order.branches?.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          City:
                        </span>{" "}
                        {order.branches?.city || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Address:
                        </span>{" "}
                        {order.branches?.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Phone:
                        </span>{" "}
                        {order.branches?.phone || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">
                          Email:
                        </span>{" "}
                        {order.branches?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <h3 className="text-base font-bold text-slate-900">
                    Order Items
                  </h3>

                  {!order.order_items?.length ? (
                    <p className="mt-3 text-sm text-slate-600">
                      No order items found.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {order.order_items.map((item) => (
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
                  )}
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Update Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      disabled={busyOrderId === order.id}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Update Payment Status
                    </label>
                    <select
                      value={order.payment_status || "pending"}
                      onChange={(e) =>
                        handlePaymentStatusChange(order.id, e.target.value)
                      }
                      disabled={busyOrderId === order.id}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Assign Staff
                    </label>
                    <select
                      value={order.assigned_staff_id || ""}
                      onChange={(e) =>
                        handleAssignStaff(order.id, e.target.value)
                      }
                      disabled={busyOrderId === order.id}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Unassigned</option>
                      {staffProfiles.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.full_name || staff.email} • {staff.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
