import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import {
  getActiveBranches,
  getAllProfiles,
  updateProfileActiveStatus,
  updateProfileBranch,
  updateProfileRole,
} from "../../lib/db";

const ROLES = ["customer", "staff", "branch_manager", "admin", "super_admin"];

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  async function loadUsersPage() {
    setLoading(true);

    const [
      { data: profileData, error: profileError },
      { data: branchData, error: branchError },
    ] = await Promise.all([getAllProfiles(), getActiveBranches()]);

    if (profileError) {
      toast.error(profileError.message || "Failed to load users.");
    }

    if (branchError) {
      toast.error(branchError.message || "Failed to load branches.");
    }

    setProfiles(profileData || []);
    setBranches(branchData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsersPage();
  }, []);

  async function handleRoleChange(profileId, role) {
    setBusyId(profileId);

    const { error } = await updateProfileRole(profileId, role);

    if (error) {
      toast.error(error.message || "Failed to update role.");
    } else {
      toast.success("Role updated.");
      await loadUsersPage();
    }

    setBusyId("");
  }

  async function handleBranchChange(profileId, branchId) {
    setBusyId(profileId);

    const { error } = await updateProfileBranch(profileId, branchId);

    if (error) {
      toast.error(error.message || "Failed to update branch.");
    } else {
      toast.success("Branch updated.");
      await loadUsersPage();
    }

    setBusyId("");
  }

  async function handleActiveChange(profileId, isActive) {
    setBusyId(profileId);

    const { error } = await updateProfileActiveStatus(profileId, isActive);

    if (error) {
      toast.error(error.message || "Failed to update active status.");
    } else {
      toast.success("User status updated.");
      await loadUsersPage();
    }

    setBusyId("");
  }

  const filteredProfiles = useMemo(() => {
    let result = [...profiles];

    if (roleFilter !== "all") {
      result = result.filter((item) => item.role === roleFilter);
    }

    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.role?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [profiles, roleFilter, search]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Users"
        subtitle="Control customer, staff, managers, and admin access."
      />

      <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <PageLoader text="Loading users..." />
      ) : !filteredProfiles.length ? (
        <EmptyState
          title="No users found"
          message="No users match your current search or filter."
        />
      ) : (
        <div className="space-y-5">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.full_name || "No Name"}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        profile.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-red-50 text-red-700 ring-1 ring-red-100"
                      }`}
                    >
                      {profile.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {profile.email || "No email"}
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Role
                      </label>
                      <select
                        value={profile.role || "customer"}
                        onChange={(e) =>
                          handleRoleChange(profile.id, e.target.value)
                        }
                        disabled={busyId === profile.id}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Branch
                      </label>
                      <select
                        value={profile.branch_id || ""}
                        onChange={(e) =>
                          handleBranchChange(profile.id, e.target.value)
                        }
                        disabled={busyId === profile.id}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="">No branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!!profile.is_active}
                          onChange={(e) =>
                            handleActiveChange(profile.id, e.target.checked)
                          }
                          disabled={busyId === profile.id}
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          Active User
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-500">
                    Joined: {new Date(profile.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
