import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";
import { getAdminReviews, updateReviewApproval } from "../../lib/db";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState("");

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await getAdminReviews();

    if (error) {
      console.error("Admin reviews error:", error);
      toast.error(error.message || "Failed to load reviews.");
      setReviews([]);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleApproval(reviewId, isApproved) {
    setBusyId(reviewId);

    const { error } = await updateReviewApproval(reviewId, isApproved);

    if (error) {
      toast.error(error.message || "Failed to update review.");
    } else {
      toast.success(isApproved ? "Review approved." : "Review hidden.");
      await loadReviews();
    }

    setBusyId("");
  }

  const filteredReviews = useMemo(() => {
    if (filter === "approved")
      return reviews.filter((item) => item.is_approved);
    if (filter === "pending")
      return reviews.filter((item) => !item.is_approved);
    return reviews;
  }, [reviews, filter]);

  return (
    <div>
      <AdminPageHeader
        title="Manage Reviews"
        subtitle="Approve customer reviews before they appear publicly."
      />

      <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Filter Reviews
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="all">All Reviews</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending Approval</option>
        </select>
      </div>

      {loading ? (
        <PageLoader text="Loading reviews..." />
      ) : !filteredReviews.length ? (
        <EmptyState
          title="No reviews found"
          message="There are no reviews matching the current filter."
        />
      ) : (
        <div className="space-y-5">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {review.title || "Customer Review"}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        review.is_approved
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                      }`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Product</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {review.products?.name || "Unknown Product"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Customer</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {review.profiles?.full_name ||
                          review.profiles?.email ||
                          "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Rating</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {review.rating}/5
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment || "No comment provided."}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApproval(review.id, true)}
                    disabled={busyId === review.id}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleApproval(review.id, false)}
                    disabled={busyId === review.id}
                    className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Hide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
