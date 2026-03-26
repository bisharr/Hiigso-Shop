export default function ProductDetailsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-96 rounded-3xl bg-slate-200"></div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Details</h1>
          <p className="mt-4 text-slate-600">
            This page will later show product info, branch stock, images,
            description, rating, and reviews.
          </p>

          <p className="mt-4 text-2xl font-bold text-blue-600">$999</p>

          <button className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
