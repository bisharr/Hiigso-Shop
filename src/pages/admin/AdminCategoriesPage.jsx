import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import CategoryForm from "../../components/admin/CategoryForm";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { getAllCategories } from "../../lib/db";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  async function loadCategories() {
    setLoading(true);

    const { data, error } = await getAllCategories();

    if (error) {
      toast.error(error.message || "Failed to load categories.");
      setCategories([]);
      setLoading(false);
      return;
    }

    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q),
    );
  }, [categories, search]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Categories"
        subtitle="Create and organize product categories."
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard
          title={selectedCategory ? "Edit Category" : "Create Category"}
        >
          <CategoryForm
            category={selectedCategory}
            onSuccess={() => {
              setSelectedCategory(null);
              loadCategories();
            }}
            onCancel={() => setSelectedCategory(null)}
          />
        </AdminSectionCard>

        <AdminSectionCard title="All Categories">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <PageLoader text="Loading categories..." />
          ) : !filteredCategories.length ? (
            <EmptyState
              title="No categories found"
              message="No categories match your current search."
            />
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {category.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.is_active
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {category.slug}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {category.description || "No description"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCategory(category)}
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
