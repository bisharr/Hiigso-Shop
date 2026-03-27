import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import BranchForm from "../../components/admin/BranchForm";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { getAllBranches } from "../../lib/db";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [search, setSearch] = useState("");

  async function loadBranches() {
    setLoading(true);

    const { data, error } = await getAllBranches();

    if (error) {
      console.error("Branches load error:", error);
      toast.error(error.message || "Failed to load branches.");
      setBranches([]);
      setLoading(false);
      return;
    }

    setBranches(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadBranches();
  }, []);

  const filteredBranches = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return branches;

    return branches.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.city?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q),
    );
  }, [branches, search]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Branches"
        subtitle="Create and manage all business branches."
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard
          title={selectedBranch ? "Edit Branch" : "Create Branch"}
        >
          <BranchForm
            branch={selectedBranch}
            onSuccess={() => {
              setSelectedBranch(null);
              loadBranches();
            }}
            onCancel={() => setSelectedBranch(null)}
          />
        </AdminSectionCard>

        <AdminSectionCard title="All Branches">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search branches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <PageLoader text="Loading branches..." />
          ) : !filteredBranches.length ? (
            <EmptyState
              title="No branches found"
              message="No branches match your current search."
            />
          ) : (
            <div className="space-y-4">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {branch.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            branch.is_active
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {branch.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {branch.city} • {branch.slug}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {branch.address || "No address"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedBranch(branch)}
                      className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
