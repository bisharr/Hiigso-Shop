import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSectionCard from "../../components/admin/AdminSectionCard";
import BrandForm from "../../components/admin/BrandForm";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { getAllBrands } from "../../lib/db";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [search, setSearch] = useState("");

  async function loadBrands() {
    setLoading(true);

    const { data, error } = await getAllBrands();

    if (error) {
      toast.error(error.message || "Failed to load brands.");
      setBrands([]);
      setLoading(false);
      return;
    }

    setBrands(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return brands;

    return brands.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q),
    );
  }, [brands, search]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Brands"
        subtitle="Create and maintain product brands."
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard title={selectedBrand ? "Edit Brand" : "Create Brand"}>
          <BrandForm
            brand={selectedBrand}
            onSuccess={() => {
              setSelectedBrand(null);
              loadBrands();
            }}
            onCancel={() => setSelectedBrand(null)}
          />
        </AdminSectionCard>

        <AdminSectionCard title="All Brands">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {loading ? (
            <PageLoader text="Loading brands..." />
          ) : !filteredBrands.length ? (
            <EmptyState
              title="No brands found"
              message="No brands match your current search."
            />
          ) : (
            <div className="space-y-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {brand.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            brand.is_active
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {brand.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {brand.slug}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedBrand(brand)}
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
