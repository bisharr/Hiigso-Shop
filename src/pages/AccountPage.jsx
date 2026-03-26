import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, profile } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

        <div className="mt-6 space-y-3 text-slate-700">
          <p>
            <span className="font-semibold">Full Name:</span>{" "}
            {profile?.full_name || "No name yet"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {profile?.role || "customer"}
          </p>
        </div>
      </div>
    </div>
  );
}
