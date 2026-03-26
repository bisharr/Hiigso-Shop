import { formatCurrency } from "../../lib/format";

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

export default function RecentOrdersTable({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
        <p className="mt-3 text-sm text-slate-600">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {order.order_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize text-slate-700">
                  {order.payment_status}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
