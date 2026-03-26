import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import PageLoader from "../components/common/PageLoader";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../lib/db";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  async function loadNotifications() {
    setLoading(true);

    const { data, error } = await getMyNotifications();

    if (error) {
      toast.error(error.message || "Failed to load notifications.");
      setNotifications([]);
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleRead(notificationId) {
    setBusyId(notificationId);

    const { error } = await markNotificationAsRead(notificationId);

    if (error) {
      toast.error(error.message || "Failed to mark notification as read.");
    } else {
      await loadNotifications();
    }

    setBusyId("");
  }

  async function handleReadAll() {
    const { error } = await markAllNotificationsAsRead();

    if (error) {
      toast.error(error.message || "Failed to mark all as read.");
    } else {
      toast.success("All notifications marked as read.");
      await loadNotifications();
    }
  }

  if (loading) {
    return <PageLoader text="Loading notifications..." />;
  }

  if (!notifications.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="No notifications yet"
          message="Important updates about orders and activity will appear here."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-2 text-slate-600">
            Stay updated with order and account activity.
          </p>
        </div>

        <button
          onClick={handleReadAll}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`rounded-[28px] p-5 shadow-sm ring-1 ${
              item.is_read
                ? "bg-white ring-slate-200"
                : "bg-blue-50 ring-blue-100"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.message}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              {!item.is_read && (
                <button
                  onClick={() => handleRead(item.id)}
                  disabled={busyId === item.id}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {busyId === item.id ? "Please wait..." : "Mark as Read"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
