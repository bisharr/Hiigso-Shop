import { Link } from "react-router-dom";
import { calculateCartSubtotal, calculateDeliveryFee } from "../../lib/db";
import { formatCurrency } from "../../lib/format";

export default function CartSummaryCard({ items = [] }) {
  const subtotal = calculateCartSubtotal(items);
  const estimatedDelivery = calculateDeliveryFee("delivery");
  const estimatedTotal = subtotal + estimatedDelivery;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">Cart Summary</h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Estimated Delivery</span>
          <span>{formatCurrency(estimatedDelivery)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
          <span>Estimated Total</span>
          <span>{formatCurrency(estimatedTotal)}</span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        Final total may change depending on pickup or delivery selection at
        checkout.
      </p>

      <Link
        to="/checkout"
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
