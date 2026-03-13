"use client";

import { useState, useEffect } from "react";

interface Submission {
  id: string;
  title: string;
  date: string;
  type: string;
  organizer: string;
  venue: string;
  description: string;
  external_url: string;
  invite_only: boolean;
  submitter_email: string;
  status: string;
  created_at: string;
  city_name: string;
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    pending: "bg-[rgba(251,191,36,0.1)] text-[#92700C] border-[rgba(251,191,36,0.25)]",
    approved: "bg-[rgba(45,95,45,0.06)] text-[#2D5F2D] border-[rgba(45,95,45,0.15)]",
    rejected: "bg-[rgba(197,48,48,0.06)] text-[#C53030] border-[rgba(197,48,48,0.16)]",
  };
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${cls[status] || cls.pending}`}>
      {status}
    </span>
  );
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${filter}`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error("Failed to load submissions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setSelected(null);
        load(); // Refresh list
      }
    } catch (e) {
      console.error("Action failed:", e);
    } finally {
      setActionLoading(false);
    }
  }

  const filters = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <div>
      <h2 className="font-display text-[22px] font-extrabold tracking-tight mb-1.5">Submissions</h2>
      <p className="font-body text-sm text-brand-textMuted mb-5">Review and approve organizer-submitted events.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setSelected(null); }}
            className={`font-body text-xs font-semibold px-3.5 py-1.5 rounded-md border ${
              filter === f.key
                ? "bg-white text-brand-text border-brand-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "bg-transparent text-brand-textMuted border-brand-borderSubtle"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-brand-textMuted text-sm">Loading...</div>
      ) : !selected ? (
        <>
          {submissions.length === 0 && (
            <div className="py-16 text-center text-brand-textMuted text-sm">No {filter} submissions.</div>
          )}
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelected(sub)}
              className="flex justify-between items-center p-3.5 mb-2 rounded-[10px] bg-white border border-brand-borderSubtle cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm text-brand-text font-medium mb-0.5">{sub.title}</div>
                <div className="font-body text-xs text-brand-textMuted">{sub.organizer} · {sub.date} · {sub.type}</div>
              </div>
              <div className="flex gap-2.5 items-center shrink-0 ml-3">
                <span className="font-body text-[11px] text-brand-textMuted hidden sm:inline">
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
                <StatusBadge status={sub.status} />
              </div>
            </div>
          ))}
        </>
      ) : (
        /* Detail View */
        <div className="p-6 rounded-xl bg-white border border-brand-borderSubtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-fadeIn">
          <button
            onClick={() => setSelected(null)}
            className="font-body text-xs text-brand-textMuted mb-4 block"
          >
            ← Back to list
          </button>

          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <h3 className="font-display text-lg font-extrabold">{selected.title}</h3>
            <StatusBadge status={selected.status} />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-5">
            {[
              ["Organizer", selected.organizer],
              ["Date", selected.date],
              ["City", selected.city_name],
              ["Type", selected.type],
              ["Venue", selected.venue || "Not provided"],
              ["Invite Only", selected.invite_only ? "Yes" : "No"],
              ["Submitted", new Date(selected.created_at).toLocaleDateString()],
            ].map(([label, value], i) => (
              <div key={i}>
                <div className="font-display text-[10px] font-bold text-brand-textMuted tracking-[0.06em] uppercase mb-0.5">{label}</div>
                <div className="font-body text-sm text-brand-text">{value}</div>
              </div>
            ))}
          </div>

          {selected.external_url && (
            <div className="mb-4">
              <div className="font-display text-[10px] font-bold text-brand-textMuted tracking-[0.06em] uppercase mb-0.5">Registration Link</div>
              <a href={selected.external_url} target="_blank" rel="noopener" className="font-body text-sm text-[#25508C] break-all">
                {selected.external_url}
              </a>
            </div>
          )}

          {selected.description && (
            <div className="mb-6">
              <div className="font-display text-[10px] font-bold text-brand-textMuted tracking-[0.06em] uppercase mb-0.5">Description</div>
              <div className="font-body text-sm text-brand-textSec leading-relaxed">{selected.description}</div>
            </div>
          )}

          {selected.status === "pending" ? (
            <div className="flex gap-2.5">
              <button
                onClick={() => handleAction(selected.id, "approve")}
                disabled={actionLoading}
                className="flex-1 font-display text-[13px] font-bold py-[11px] rounded-lg bg-brand-highlight text-white disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "✓ Approve & Publish"}
              </button>
              <button
                onClick={() => handleAction(selected.id, "reject")}
                disabled={actionLoading}
                className="flex-1 font-display text-[13px] font-bold py-[11px] rounded-lg border-[1.5px] border-[rgba(197,48,48,0.16)] text-[#C53030] disabled:opacity-60"
              >
                ✗ Reject
              </button>
            </div>
          ) : (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              selected.status === "approved"
                ? "bg-[rgba(45,95,45,0.06)] text-brand-highlight"
                : "bg-[rgba(197,48,48,0.06)] text-[#C53030]"
            }`}>
              This submission has been {selected.status}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
