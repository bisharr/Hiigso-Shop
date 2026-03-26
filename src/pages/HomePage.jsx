import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-3 inline-block w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              Trusted Electronics Across Somalia
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Smart electronics shopping for every branch, every city
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
              Hiigso Electronics Online gives customers a fast, beautiful, and
              secure way to shop phones, laptops, accessories, and home devices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
              >
                Shop Now
              </Link>
              <Link
                to="/register"
                className="rounded-2xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow">
                <h3 className="text-lg font-bold">Multi-Branch Ready</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Manage stock and orders across many branches in Somalia.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow">
                <h3 className="text-lg font-bold">Secure Checkout</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Safe authentication, protected routes, and RLS-powered access.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow">
                <h3 className="text-lg font-bold">Responsive Design</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Beautiful shopping experience on mobile, tablet, and desktop.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow">
                <h3 className="text-lg font-bold">Analytics Dashboard</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Sales insights, order trends, and branch performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Featured Categories
          </h2>
          <p className="mt-2 text-slate-600">
            A clean modern storefront for your top products.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["Smartphones", "Laptops", "Accessories", "Home Electronics"].map(
            (item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-slate-900">{item}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Explore the latest {item.toLowerCase()} available at Hiigso.
                </p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-700"
                >
                  Browse
                </Link>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
