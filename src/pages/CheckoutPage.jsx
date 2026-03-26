import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageLoader from "../components/common/PageLoader";
import EmptyState from "../components/common/EmptyState";
import CheckoutSummaryCard from "../components/storefront/CheckoutSummaryCard";
import { createOrderFromCart, getMyCartItems } from "../lib/db";
import { checkoutSchema, validateWithZod } from "../lib/validators";
import { useAuth } from "../contexts/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    contactName: profile?.full_name || "",
    contactPhone: profile?.phone || "",
    contactEmail: user?.email || "",
    fulfillmentMethod: "pickup",
    paymentMethod: "evc",
    branchId: "",
    deliveryAddress: "",
    customerNote: "",
  });

  const [errors, setErrors] = useState({});

  async function loadCheckout() {
    setLoading(true);

    const { data, error, cart: activeCart } = await getMyCartItems();

    if (error) {
      toast.error(error.message || "Failed to load checkout.");
      setItems([]);
      setCart(null);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setCart(activeCart || null);

    const uniqueBranchIds = [
      ...new Set((data || []).map((item) => item.branch_id)),
    ];
    const defaultBranchId =
      uniqueBranchIds.length === 1 ? uniqueBranchIds[0] : "";

    setFormData((prev) => ({
      ...prev,
      contactName: profile?.full_name || prev.contactName || "",
      contactPhone: profile?.phone || prev.contactPhone || "",
      contactEmail: user?.email || prev.contactEmail || "",
      branchId: prev.branchId || defaultBranchId,
    }));

    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    loadCheckout();
  }, [user, profile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const branchOptions = useMemo(() => {
    const map = new Map();

    items.forEach((item) => {
      if (!map.has(item.branch_id)) {
        map.set(item.branch_id, {
          id: item.branch_id,
          name: item.branches?.name || "Branch",
          city: item.branches?.city || "",
        });
      }
    });

    return Array.from(map.values());
  }, [items]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    if (!items.length || !cart) {
      toast.error("Your cart is empty.");
      setSubmitting(false);
      return;
    }

    const validation = validateWithZod(checkoutSchema, formData);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the checkout form errors.");
      setSubmitting(false);
      return;
    }

    const { data: order, error } = await createOrderFromCart({
      cart,
      cartItems: items,
      checkoutData: validation.data,
    });

    if (error) {
      toast.error(error.message || "Failed to place order.");
      setSubmitting(false);
      return;
    }

    toast.success("Order placed successfully.");
    navigate(
      `/checkout/success?orderNumber=${encodeURIComponent(order.order_number)}`,
    );
    setSubmitting(false);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Please login first"
          message="You need to login before checking out."
          action={
            <Link
              to="/login"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return <PageLoader text="Preparing checkout..." />;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          message="Add products to your cart before checkout."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">
          Complete your order with branch, payment, and delivery details.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
        >
          <h2 className="text-xl font-bold text-slate-900">Customer Details</h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactPhone}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contactEmail}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Fulfillment Method
                </label>
                <select
                  name="fulfillmentMethod"
                  value={formData.fulfillmentMethod}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="sahal_golis">Sahal / Golis</option>
                  <option value="evc">EVC</option>
                  <option value="edahab">E-Dahab</option>
                  <option value="salaam_bank_waafi">Salaam Bank / Waafi</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Branch
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} {branch.city ? `• ${branch.city}` : ""}
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <p className="mt-1 text-sm text-red-500">{errors.branchId}</p>
              )}
            </div>

            {formData.fulfillmentMethod === "delivery" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Delivery Address
                </label>
                <textarea
                  name="deliveryAddress"
                  rows="4"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Customer Note
              </label>
              <textarea
                name="customerNote"
                rows="4"
                value={formData.customerNote}
                onChange={handleChange}
                placeholder="Optional note about the order..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {errors.customerNote && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.customerNote}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <CheckoutSummaryCard
          items={items}
          fulfillmentMethod={formData.fulfillmentMethod}
          paymentMethod={formData.paymentMethod}
        />
      </div>
    </div>
  );
}
