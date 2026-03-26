import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categorySchema, validateWithZod } from "../../lib/validators";
import { createCategory, updateCategory } from "../../lib/db";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildInitialForm(category) {
  return {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
  };
}

export default function CategoryForm({ category = null, onSuccess, onCancel }) {
  const isEdit = !!category;
  const [formData, setFormData] = useState(buildInitialForm(category));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm(category));
    setErrors({});
  }, [category]);

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

    const validation = validateWithZod(categorySchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the category form errors.");
      setSubmitting(false);
      return;
    }

    const result = isEdit
      ? await updateCategory(category.id, validation.data)
      : await createCategory(validation.data);

    if (result.error) {
      toast.error(result.error.message || "Failed to save category.");
      setSubmitting(false);
      return;
    }

    toast.success(isEdit ? "Category updated." : "Category created.");
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Category Name
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
          Description
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
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
            Active Category
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Category"
              : "Create Category"}
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
