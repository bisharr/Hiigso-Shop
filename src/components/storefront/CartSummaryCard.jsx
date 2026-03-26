import { formatCurrency } from "../../lib/format";

export default function CartSummaryCard({ items = [] }) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
    0,
  );

  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Items</span>
          <span>{items.length}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Delivery</span>
          <span>{formatCurrency(delivery)}</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
