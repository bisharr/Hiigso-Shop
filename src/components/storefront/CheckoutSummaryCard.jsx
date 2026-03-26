import { formatCurrency, formatPaymentMethod } from "../../lib/format";
import { calculateCartSubtotal, calculateDeliveryFee } from "../../lib/db";

export default function CheckoutSummaryCard({
  items = [],
  fulfillmentMethod = "pickup",
  paymentMethod = "evc",
}) {
  const subtotal = calculateCartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(fulfillmentMethod);
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">Checkout Summary</h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {item.products?.name || "Product"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Qty {item.quantity} • {item.branches?.name || "Branch"}
              </p>
            </div>

            <p className="font-semibold text-slate-900">
              {formatCurrency(Number(item.unit_price) * Number(item.quantity))}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Payment Method</span>
          <span>{formatPaymentMethod(paymentMethod)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Delivery Fee</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>

        <div className="flex items-center justify-between pt-2 text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
