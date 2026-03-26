import { Link, NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-blue-800 px-4 py-3 text-white"
      : "block rounded-xl px-4 py-3 text-slate-700 hover:bg-blue-100";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-72 lg:border-b-0 lg:border-r">
          <Link
            to="/admin"
            className="mb-6 block text-2xl font-bold text-slate-900"
          >
            Hiigso Admin
          </Link>

          <nav className="space-y-2">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/reviews" className={linkClass}>
              Reviews
            </NavLink>
            <NavLink to="/admin/branches" className={linkClass}>
              Branches
            </NavLink>
            <NavLink to="/admin/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/admin/brands" className={linkClass}>
              Brands
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              Users
            </NavLink>
          </nav>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
