export default function ShopPage() {
  const products = [
    { id: 1, name: "iPhone 15 Pro", price: "$999" },
    { id: 2, name: "Samsung Galaxy S24", price: "$899" },
    { id: 3, name: "HP EliteBook", price: "$1200" },
    { id: 4, name: "Sony Headphones", price: "$220" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shop Products</h1>
        <p className="mt-2 text-slate-600">
          Later we will connect this page to Supabase products and branch stock.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 h-44 rounded-2xl bg-slate-100"></div>
            <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
            <p className="mt-2 text-slate-600">{product.price}</p>
            <button className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
