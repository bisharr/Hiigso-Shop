import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import OrderDetailsPage from "../pages/OrderDetailsPage";

import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AccountPage from "../pages/AccountPage";
import WishlistPage from "../pages/WishlistPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import NotificationsPage from "../pages/NotificationsPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminProductEditorPage from "../pages/admin/AdminProductEditorPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";
import AdminBranchesPage from "../pages/admin/AdminBranchesPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminBrandsPage from "../pages/admin/AdminBrandsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/account/orders/:orderId"
            element={<OrderDetailsPage />}
          />
          <Route path="/account/orders" element={<MyOrdersPage />} />
          <Route
            path="/account/notifications"
            element={<NotificationsPage />}
          />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Route>

      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["admin", "super_admin", "branch_manager", "staff"]}
          />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route
            path="products/:productId"
            element={<AdminProductEditorPage />}
          />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="branches" element={<AdminBranchesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
