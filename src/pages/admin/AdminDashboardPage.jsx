export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Orders", value: "245" },
    { title: "Revenue", value: "$24,500" },
    { title: "Pending Orders", value: "18" },
    { title: "Low Stock Items", value: "12" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">
        This dashboard will later connect to real analytics from Supabase.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm font-medium text-slate-500">{item.title}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
