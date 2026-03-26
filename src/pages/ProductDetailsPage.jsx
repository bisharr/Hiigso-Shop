import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineTruck,
} from "react-icons/hi2";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import BranchStockList from "../components/storefront/BranchStockList";
import ReviewForm from "../components/storefront/ReviewForm";
import { formatCurrency } from "../lib/format";
import {
  addToCart,
  addToWishlist,
  getApprovedReviews,
  getPublicProductBySlug,
  getWishlistItemByProduct,
  removeFromWishlistByProduct,
} from "../lib/db";
import { useAuth } from "../contexts/AuthContext";

function getSortedImages(product) {
  if (!product?.product_images?.length) return [];
  return [...product.product_images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  async function loadProduct() {
    setLoading(true);

    const { data, error } = await getPublicProductBySlug(slug);

    if (error || !data) {
      setProduct(null);
      setReviews([]);
      setLoading(false);
      return;
    }

    setProduct(data);

    const images = getSortedImages(data);
    setSelectedImage(images[0]?.image_url || "");

    const firstAvailableBranch = (data.inventory || []).find(
      (item) => item.is_available && item.stock_quantity > 0,
    );
    setSelectedBranchId(firstAvailableBranch?.branch_id || "");

    const { data: reviewData } = await getApprovedReviews(data.id);
    setReviews(reviewData || []);

    if (user) {
      const { data: wish } = await getWishlistItemByProduct(data.id);
      setWishlistActive(!!wish);
    } else {
      setWishlistActive(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProduct();
  }, [slug, user]);

  const images = useMemo(() => getSortedImages(product), [product]);

  const availableBranches = useMemo(() => {
    return (product?.inventory || []).filter(
      (item) => item.is_available && item.stock_quantity > 0,
    );
  }, [product]);

  const selectedBranchStock = useMemo(() => {
    return availableBranches.find(
      (item) => item.branch_id === selectedBranchId,
    );
  }, [availableBranches, selectedBranchId]);

  const inStock = availableBranches.length > 0;

  async function handleAddToCart() {
    if (!user) {
      toast.error("Please login first to add items to cart.");
      navigate("/login");
      return;
    }

    if (!product) return;

    if (!selectedBranchId) {
      toast.error("Please choose a branch first.");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    if (selectedBranchStock && quantity > selectedBranchStock.stock_quantity) {
      toast.error("Selected quantity is more than available stock.");
      return;
    }

    setCartBusy(true);

    const { error } = await addToCart({
      productId: product.id,
      branchId: selectedBranchId,
      quantity,
      unitPrice: product.price,
    });

    if (error) {
      toast.error(error.message || "Failed to add item to cart.");
    } else {
      toast.success("Product added to cart.");
    }

    setCartBusy(false);
  }

  async function handleWishlistToggle() {
    if (!user) {
      toast.error("Please login first to use wishlist.");
      navigate("/login");
      return;
    }

    if (!product) return;

    setWishlistBusy(true);

    if (wishlistActive) {
      const { error } = await removeFromWishlistByProduct(product.id);

      if (error) {
        toast.error(error.message || "Failed to remove from wishlist.");
      } else {
        setWishlistActive(false);
        toast.success("Removed from wishlist.");
      }
    } else {
      const { error } = await addToWishlist(product.id);

      if (error) {
        toast.error(error.message || "Failed to add to wishlist.");
      } else {
        setWishlistActive(true);
        toast.success("Added to wishlist.");
      }
    }

    setWishlistBusy(false);
  }

  if (loading) {
    return <PageLoader text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Product not found"
          message="The product you are looking for does not exist or is not publicly available."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Back to Shop
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex h-[380px] items-center justify-center bg-slate-100 sm:h-[520px]">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-400">
                    No Image
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.image_url)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      selectedImage === image.image_url
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  {product?.categories?.name || "Category"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {product?.brands?.name || "Brand"}
                </span>
                {product.is_featured && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <HiOutlineStar className="h-4 w-4" />
                  {product.rating_average || 0} rating
                </span>

                <span className="text-sm text-slate-500">
                  {product.rating_count || 0} review
                  {product.rating_count === 1 ? "" : "s"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    inStock
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-red-50 text-red-700 ring-1 ring-red-100"
                  }`}
                >
                  {inStock ? "Available" : "Currently Unavailable"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <p className="text-4xl font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </p>

                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <p className="pb-1 text-lg text-slate-400 line-through">
                      {formatCurrency(product.compare_at_price)}
                    </p>
                  )}
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
                {product.description ||
                  product.short_description ||
                  "No description available."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <HiOutlineShieldCheck className="h-6 w-6 text-blue-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Secure shopping
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <HiOutlineTruck className="h-6 w-6 text-blue-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Delivery & pickup
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <HiOutlineCheckCircle className="h-6 w-6 text-blue-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Branch stock visibility
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Choose Branch
                  </label>

                  <div className="grid gap-3">
                    {availableBranches.map((item) => {
                      const active = selectedBranchId === item.branch_id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedBranchId(item.branch_id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {item.branches?.name || "Branch"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.branches?.city || "City"}
                              </p>
                            </div>

                            <div className="text-sm font-medium text-slate-700">
                              Qty: {item.stock_quantity}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartBusy || !inStock}
                  className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cartBusy ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistBusy}
                  className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {wishlistBusy
                    ? "Please wait..."
                    : wishlistActive
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                </button>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                SKU:{" "}
                <span className="font-medium text-slate-700">
                  {product.sku}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Product Description
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {product.description ||
                  product.short_description ||
                  "No description available."}
              </p>

              <div className="mt-10">
                <h3 className="text-xl font-bold text-slate-900">
                  Customer Reviews
                </h3>

                {!reviews.length ? (
                  <p className="mt-3 text-sm text-slate-600">
                    No approved reviews yet for this product.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-semibold text-slate-900">
                            {review.title || "Customer Review"}
                          </h4>
                          <span className="text-sm font-medium text-amber-600">
                            {review.rating}/5
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {review.comment || "No comment provided."}
                        </p>

                        <p className="mt-3 text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {user ? (
              <ReviewForm productId={product.id} onSubmitted={loadProduct} />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  Please login to submit a review.
                </p>
              </div>
            )}
          </div>

          <BranchStockList inventory={product.inventory || []} />
        </div>
      </div>
    </div>
  );
}
