import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { branchSchema, validateWithZod } from "../../lib/validators";
import { createBranch, updateBranch } from "../../lib/db";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildInitialForm(branch) {
  return {
    name: branch?.name || "",
    slug: branch?.slug || "",
    city: branch?.city || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    is_active: branch?.is_active ?? true,
  };
}

export default function BranchForm({ branch = null, onSuccess, onCancel }) {
  const isEdit = !!branch;
  const [formData, setFormData] = useState(buildInitialForm(branch));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm(branch));
    setErrors({});
  }, [branch]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "name" && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: slugify(value),
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const validation = validateWithZod(branchSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the branch form errors.");
      setSubmitting(false);
      return;
    }

    const result = isEdit
      ? await updateBranch(branch.id, validation.data)
      : await createBranch(validation.data);

    if (result.error) {
      toast.error(result.error.message || "Failed to save branch.");
      setSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Branch updated." : "Branch created.");
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Branch Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span className="text-sm font-semibold text-slate-700">
            Active Branch
          </span>
        </label>
      </div>

      <div className="md:col-span-2 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Branch"
              : "Create Branch"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
