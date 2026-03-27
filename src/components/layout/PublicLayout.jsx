import { Link, NavLink, Outlet } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";

export default function PublicLayout() {
  const { user, profile, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
  }

  const navClass = ({ isActive }) =>
    isActive
      ? "font-semibold text-blue-600"
      : "font-medium text-slate-700 transition hover:text-blue-600";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Hiigso Electronics
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={user ? "/wishlist" : "/login"}
              className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <HiOutlineHeart className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <HiOutlineShoppingCart className="h-5 w-5" />
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/account"
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {profile?.full_name || "Account"}
                </Link>

                {(profile?.role === "admin" ||
                  profile?.role === "super_admin" ||
                  profile?.role === "branch_manager" ||
                  profile?.role === "staff") && (
                  <Link
                    to="/admin"
                    className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Hiigso Electronics
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A modern electronics ecommerce platform designed for beautiful
              customer shopping and strong multi-branch business control.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Quick Links</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Home</p>
              <p>Shop</p>
              <p>Cart</p>
              <p>Account</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Support</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Secure checkout</p>
              <p>Multi-branch support</p>
              <p>Responsive shopping experience</p>
              <p>Built with React + Supabase</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
