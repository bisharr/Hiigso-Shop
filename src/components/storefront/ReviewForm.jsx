import { useState } from "react";
import toast from "react-hot-toast";
import { reviewSchema, validateWithZod } from "../../lib/validators";
import { submitProductReview } from "../../lib/db";

export default function ReviewForm({ productId, onSubmitted }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const validation = validateWithZod(reviewSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the review form errors.");
      setSubmitting(false);
      return;
    }

    const { error } = await submitProductReview({
      productId,
      rating: validation.data.rating,
      title: validation.data.title,
      comment: validation.data.comment,
    });

    if (error) {
      toast.error(error.message || "Failed to submit review.");
      setSubmitting(false);
      return;
    }

    toast.success("Review submitted. It will appear after approval.");
    setFormData({
      rating: 5,
      title: "",
      comment: "",
    });
    setSubmitting(false);
    onSubmitted?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 p-5"
    >
      <h4 className="text-lg font-bold text-slate-900">Write a Review</h4>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Rating
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Very Good</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Fair</option>
            <option value={1}>1 - Poor</option>
          </select>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Comment
          </label>
          <textarea
            name="comment"
            rows="4"
            value={formData.comment}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
