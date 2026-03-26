import { Link, NavLink, Outlet } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";

export default function PublicLayout() {
  const { user, profile, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
  }

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-slate-700 hover:text-blue-600";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold text-slate-900">
            Hiigso Electronics
          </Link>

          <nav className="hidden gap-6 md:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navClass}>
              Shop
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              Cart
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
            >
              <HiOutlineShoppingCart size={20} />
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {profile?.full_name || "My Account"}
                </Link>

                {(profile?.role === "admin" ||
                  profile?.role === "super_admin" ||
                  profile?.role === "branch_manager" ||
                  profile?.role === "staff") && (
                  <Link
                    to="/admin"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
          © 2026 Hiigso Electronics Online. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
