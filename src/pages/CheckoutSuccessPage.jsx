import { Link, useSearchParams } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Order placed successfully
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
          Thank you for shopping with Hiigso Electronics. Your order has been
          created successfully and is now waiting for processing.
        </p>

        {orderNumber && (
          <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-left ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Order Number</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/account/orders"
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
