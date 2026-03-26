import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, profile } = useAuth();

  const cards = [
    {
      title: "My Cart",
      text: "View and manage products you plan to buy.",
      to: "/cart",
    },
    {
      title: "My Wishlist",
      text: "See saved products you liked.",
      to: "/wishlist",
    },
    {
      title: "My Orders",
      text: "Track all your placed orders.",
      to: "/account/orders",
    },
    {
      title: "Checkout",
      text: "Complete your order securely.",
      to: "/checkout",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {profile?.full_name || "No name yet"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {user?.email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-1 text-lg font-bold capitalize text-slate-900">
              {profile?.role || "customer"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Branch</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {profile?.branch_id || "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
