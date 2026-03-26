import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { brandSchema, validateWithZod } from "../../lib/validators";
import { createBrand, updateBrand } from "../../lib/db";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildInitialForm(brand) {
  return {
    name: brand?.name || "",
    slug: brand?.slug || "",
    is_active: brand?.is_active ?? true,
  };
}

export default function BrandForm({ brand = null, onSuccess, onCancel }) {
  const isEdit = !!brand;
  const [formData, setFormData] = useState(buildInitialForm(brand));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm(brand));
    setErrors({});
  }, [brand]);

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

    const validation = validateWithZod(brandSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the brand form errors.");
      setSubmitting(false);
      return;
    }

    const result = isEdit
      ? await updateBrand(brand.id, validation.data)
      : await createBrand(validation.data);

    if (result.error) {
      toast.error(result.error.message || "Failed to save brand.");
      setSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Brand updated." : "Brand created.");
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Brand Name
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
        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span className="text-sm font-semibold text-slate-700">
            Active Brand
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update Brand" : "Create Brand"}
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
