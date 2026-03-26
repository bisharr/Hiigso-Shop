import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminProductSchema, validateWithZod } from "../../lib/validators";
import {
  createProduct,
  saveProductPrimaryImage,
  updateProduct,
  uploadProductImageFile,
} from "../../lib/db";

function buildInitialForm(product) {
  return {
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    brand_id: product?.brand_id || "",
    short_description: product?.short_description || "",
    description: product?.description || "",
    price: product?.price ?? "",
    compare_at_price: product?.compare_at_price ?? "",
    status: product?.status || "draft",
    is_featured: !!product?.is_featured,
    image_alt:
      product?.product_images?.find((img) => img.is_primary)?.alt_text || "",
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminProductForm({
  product = null,
  categories = [],
  brands = [],
  onSuccess,
  onCancel,
}) {
  const isEdit = !!product;

  const [formData, setFormData] = useState(buildInitialForm(product));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    product?.product_images?.find((img) => img.is_primary)?.image_url || "",
  );

  useEffect(() => {
    setFormData(buildInitialForm(product));
    setErrors({});
    setImageFile(null);
    setPreviewUrl(
      product?.product_images?.find((img) => img.is_primary)?.image_url || "",
    );
  }, [product]);

  const title = useMemo(
    () => (isEdit ? "Edit Product" : "Create Product"),
    [isEdit],
  );

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

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const validation = validateWithZod(adminProductSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the product form errors.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...validation.data,
      compare_at_price:
        validation.data.compare_at_price === ""
          ? null
          : validation.data.compare_at_price,
    };

    let result;

    if (isEdit) {
      result = await updateProduct(product.id, payload);
    } else {
      result = await createProduct(payload);
    }

    if (result.error || !result.data) {
      toast.error(result.error?.message || "Failed to save product.");
      setSubmitting(false);
      return;
    }

    let finalImageUrl =
      product?.product_images?.find((img) => img.is_primary)?.image_url || "";

    if (imageFile) {
      const uploadResult = await uploadProductImageFile(
        imageFile,
        result.data.id,
      );

      if (uploadResult.error || !uploadResult.data) {
        toast.error(
          uploadResult.error?.message ||
            "Product saved, but image upload failed.",
        );
        setSubmitting(false);
        return;
      }

      finalImageUrl = uploadResult.data.publicUrl;
    }

    if (finalImageUrl) {
      const imageResult = await saveProductPrimaryImage({
        productId: result.data.id,
        imageUrl: finalImageUrl,
        altText: payload.image_alt,
      });

      if (imageResult.error) {
        toast.error(
          imageResult.error.message || "Product saved but image record failed.",
        );
        setSubmitting(false);
        return;
      }
    }

    toast.success(
      isEdit
        ? "Product updated successfully."
        : "Product created successfully.",
    );
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
    >
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Product Name
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
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Brand
          </label>
          <select
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select brand</option>
            {brands.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand_id && (
            <p className="mt-1 text-sm text-red-500">{errors.brand_id}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Compare Price
          </label>
          <input
            type="number"
            step="0.01"
            name="compare_at_price"
            value={formData.compare_at_price}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.compare_at_price && (
            <p className="mt-1 text-sm text-red-500">
              {errors.compare_at_price}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            <span className="text-sm font-semibold text-slate-700">
              Featured Product
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Short Description
          </label>
          <textarea
            name="short_description"
            rows="3"
            value={formData.short_description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.short_description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.short_description}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Description
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Upload Product Image
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-slate-500">
            Use JPG, PNG, or WEBP. Maximum 5MB.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Image Alt Text
          </label>
          <input
            type="text"
            name="image_alt"
            value={formData.image_alt}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {previewUrl && (
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image Preview
            </label>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-72 w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
