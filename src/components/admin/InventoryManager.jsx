import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getInventoryByProduct, upsertInventoryRow } from "../../lib/db";

function buildRow(branch, existingRow) {
  return {
    branch_id: branch.id,
    branch_name: branch.name,
    branch_city: branch.city || "",
    stock_quantity: existingRow?.stock_quantity ?? 0,
    reserved_quantity: existingRow?.reserved_quantity ?? 0,
    low_stock_threshold: existingRow?.low_stock_threshold ?? 5,
    is_available: existingRow?.is_available ?? true,
  };
}

export default function InventoryManager({ productId, branches = [] }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingBranchId, setSavingBranchId] = useState("");

  async function loadInventory() {
    if (!productId) return;

    setLoading(true);

    const { data, error } = await getInventoryByProduct(productId);

    if (error) {
      toast.error(error.message || "Failed to load inventory.");
      setLoading(false);
      return;
    }

    const inventoryMap = new Map(
      (data || []).map((item) => [item.branch_id, item]),
    );

    const mergedRows = branches.map((branch) =>
      buildRow(branch, inventoryMap.get(branch.id)),
    );

    setRows(mergedRows);
    setLoading(false);
  }

  useEffect(() => {
    loadInventory();
  }, [productId, branches]);

  function handleChange(branchId, field, value, type = "text") {
    setRows((prev) =>
      prev.map((row) =>
        row.branch_id === branchId
          ? {
              ...row,
              [field]:
                type === "checkbox"
                  ? value
                  : [
                        "stock_quantity",
                        "reserved_quantity",
                        "low_stock_threshold",
                      ].includes(field)
                    ? Number(value)
                    : value,
            }
          : row,
      ),
    );
  }

  async function handleSave(row) {
    setSavingBranchId(row.branch_id);

    const { error } = await upsertInventoryRow({
      product_id: productId,
      branch_id: row.branch_id,
      stock_quantity: row.stock_quantity,
      reserved_quantity: row.reserved_quantity,
      low_stock_threshold: row.low_stock_threshold,
      is_available: row.is_available,
    });

    if (error) {
      toast.error(error.message || "Failed to save inventory.");
    } else {
      toast.success(`Inventory saved for ${row.branch_name}.`);
      await loadInventory();
    }

    setSavingBranchId("");
  }

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Branch Inventory</h2>
      <p className="mt-2 text-slate-600">
        Manage stock and availability branch by branch.
      </p>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200"></div>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="h-10 animate-pulse rounded bg-slate-200"></div>
                <div className="h-10 animate-pulse rounded bg-slate-200"></div>
                <div className="h-10 animate-pulse rounded bg-slate-200"></div>
                <div className="h-10 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {rows.map((row) => (
            <div
              key={row.branch_id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {row.branch_name}
                  </h3>
                  <p className="text-sm text-slate-500">{row.branch_city}</p>
                </div>

                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={row.is_available}
                    onChange={(e) =>
                      handleChange(
                        row.branch_id,
                        "is_available",
                        e.target.checked,
                        "checkbox",
                      )
                    }
                  />
                  Available
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={row.stock_quantity}
                    onChange={(e) =>
                      handleChange(
                        row.branch_id,
                        "stock_quantity",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Reserved Quantity
                  </label>
                  <input
                    type="number"
                    value={row.reserved_quantity}
                    onChange={(e) =>
                      handleChange(
                        row.branch_id,
                        "reserved_quantity",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={row.low_stock_threshold}
                    onChange={(e) =>
                      handleChange(
                        row.branch_id,
                        "low_stock_threshold",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave(row)}
                disabled={savingBranchId === row.branch_id}
                className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {savingBranchId === row.branch_id
                  ? "Saving..."
                  : "Save Inventory"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
