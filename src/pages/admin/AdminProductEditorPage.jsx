import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageLoader from "../../components/common/PageLoader";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminProductForm from "../../components/admin/AdminProductForm";
import InventoryManager from "../../components/admin/InventoryManager";
import {
  getActiveBranches,
  getActiveBrands,
  getActiveCategories,
  getAdminProductById,
} from "../../lib/db";

export default function AdminProductEditorPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isCreate = productId === "new";

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPage() {
    setLoading(true);

    const [{ data: categoryData }, { data: brandData }, { data: branchData }] =
      await Promise.all([
        getActiveCategories(),
        getActiveBrands(),
        getActiveBranches(),
      ]);

    setCategories(categoryData || []);
    setBrands(brandData || []);
    setBranches(branchData || []);

    if (isCreate) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const { data, error } = await getAdminProductById(productId);

    if (error || !data) {
      toast.error("Failed to load product.");
      navigate("/admin/products");
      return;
    }

    setProduct(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, [productId]);

  if (loading) {
    return <PageLoader text="Loading product editor..." />;
  }

  return (
    <div>
      <AdminPageHeader
        title={isCreate ? "Create Product" : "Edit Product"}
        subtitle="Manage product details, pricing, status, image, and branch inventory."
        action={
          <Link
            to="/admin/products"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to Products
          </Link>
        }
      />

      <div className="space-y-8">
        <AdminProductForm
          product={product}
          categories={categories}
          brands={brands}
          onSuccess={() => navigate("/admin/products")}
          onCancel={() => navigate("/admin/products")}
        />

        {!isCreate && (
          <InventoryManager productId={productId} branches={branches} />
        )}
      </div>
    </div>
  );
}
