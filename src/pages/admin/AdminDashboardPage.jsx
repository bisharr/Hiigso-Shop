import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AnalyticsStatCard from "../../components/admin/AnalyticsStatCard";
import RecentOrdersTable from "../../components/admin/RecentOrdersTable";
import LowStockList from "../../components/admin/LowStockList";
import PageLoader from "../../components/common/PageLoader";
import { formatCurrency } from "../../lib/format";
import { getDashboardAnalytics } from "../../lib/db";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);

    const { data, error } = await getDashboardAnalytics();

    if (error) {
      console.error("Dashboard analytics error:", error);
      toast.error(error.message || "Failed to load dashboard analytics.");
      setOrders([]);
      setInventory([]);
      setLoading(false);
      return;
    }

    setOrders(data?.orders || []);
    setInventory(data?.inventory || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0,
    );

    const pendingOrders = orders.filter(
      (order) => order.status === "pending",
    ).length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered",
    ).length;
    const totalOrders = orders.length;

    return {
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      totalOrders,
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(
      (item) => Number(item.stock_quantity) <= Number(item.low_stock_threshold),
    );
  }, [inventory]);

  if (loading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <div>
      <AdminPageHeader
        title="Admin Dashboard"
        subtitle="Monitor sales, orders, and stock performance across your business."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          helper="All recorded orders"
        />
        <AnalyticsStatCard
          label="Total Orders"
          value={stats.totalOrders}
          helper="Orders placed in system"
        />
        <AnalyticsStatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          helper="Orders waiting for action"
        />
        <AnalyticsStatCard
          label="Delivered Orders"
          value={stats.deliveredOrders}
          helper="Completed successfully"
        />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentOrdersTable orders={recentOrders} />
        <LowStockList items={lowStockItems} />
      </div>
    </div>
  );
}
