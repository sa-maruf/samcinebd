// src/admin/pages/AdminRequests.jsx
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { listRequests, updateRequestStatus, deleteRequest } from "../../services/adminService";
import { TableSkeleton } from "../components/AdminSkeletons";

const STATUS_STYLES = {
  pending: "bg-marquee-500/15 text-marquee-400",
  approved: "bg-signal-series/15 text-signal-series",
  rejected: "bg-signal-mature/15 text-signal-mature",
};

const TABS = ["all", "pending", "approved", "rejected"];

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  async function load() {
    setLoading(true);
    setRequests(await listRequests());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id, status) {
    await updateRequestStatus(id, status);
    load();
  }

  async function handleDelete(id) {
    await deleteRequest(id);
    load();
  }

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-2xl tracking-wide text-mist-100 mb-4">Movie Requests</h1>

      <div className="flex gap-1 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-pill text-xs font-medium capitalize transition-colors ${
              tab === t ? "bg-marquee-500 text-ink-950" : "bg-ink-800 border border-ink-600 text-mist-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-xs text-mist-500 border-b border-ink-600">
              <th className="px-4 py-3 font-medium">Movie Name</th>
              <th className="px-4 py-3 font-medium">Note</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={5} cols={4} />}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-mist-500">No requests here.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-ink-700 last:border-0">
                <td className="px-4 py-3 text-mist-100">{r.movieName}</td>
                <td className="px-4 py-3 text-mist-500 max-w-xs truncate">{r.note || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    className={`badge border-0 cursor-pointer ${STATUS_STYLES[r.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-mist-500 hover:text-signal-mature">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
