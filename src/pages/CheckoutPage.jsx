export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Customer Details</h2>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Delivery Address"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
          <p className="mt-4 text-slate-600">Subtotal: $0.00</p>
          <p className="mt-2 text-slate-600">Delivery: $0.00</p>
          <p className="mt-2 text-lg font-bold text-slate-900">Total: $0.00</p>

          <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
