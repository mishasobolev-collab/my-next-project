"use client";

import { useState, useEffect } from "react";

interface Subscriber {
  id: string;
  email: string;
  city: string;
  frequency: string;
  title: string;
  is_active: boolean;
  joined: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const param = cityFilter === "all" ? "" : `?city=${cityFilter}`;
        const res = await fetch(`/api/admin/subscribers${param}`);
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setTotal(data.active || 0);
      } catch (e) {
        console.error("Failed to load subscribers:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [cityFilter]);

  function exportCSV() {
    const param = cityFilter === "all" ? "" : `city=${cityFilter}&`;
    window.open(`/api/admin/subscribers?${param}format=csv`, "_blank");
  }

  const cities = ["all", "chicago", "new-york", "washington-dc"];
  const cityLabels: Record<string, string> = {
    all: "All Cities", chicago: "Chicago", "new-york": "New York", "washington-dc": "DC",
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-1.5 flex-wrap gap-2">
        <h2 className="font-display text-[22px] font-extrabold tracking-tight">Subscribers</h2>
        <div className="font-display text-[13px] font-bold text-brand-highlight bg-[rgba(45,95,45,0.06)] px-3.5 py-1.5 rounded-md border border-[rgba(45,95,45,0.15)]">
          {total} active
        </div>
      </div>
      <p className="font-body text-sm text-brand-textMuted mb-5">All subscribers. Waitlisted subscribers are in non-live cities.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCityFilter(c)}
            className={`font-body text-xs font-semibold px-3.5 py-1.5 rounded-md border ${
              cityFilter === c
                ? "bg-white text-brand-text border-brand-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "bg-transparent text-brand-textMuted border-brand-borderSubtle"
            }`}
          >
            {cityLabels[c] || c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-brand-textMuted text-sm">Loading...</div>
      ) : (
        <div className="rounded-[10px] overflow-hidden border border-brand-borderSubtle bg-white">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-2 px-4 py-2.5 bg-brand-surfaceAlt border-b border-brand-borderSubtle">
            {["Email", "City", "Frequency", "Title", "Joined"].map((h) => (
              <div key={h} className="font-display text-[10px] font-bold text-brand-textMuted tracking-[0.06em] uppercase">{h}</div>
            ))}
          </div>

          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-brand-textMuted text-sm">No subscribers found.</div>
          ) : (
            subscribers.map((sub, i) => (
              <div
                key={sub.id}
                className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-1 sm:gap-2 px-4 py-3 items-center ${
                  i < subscribers.length - 1 ? "border-b border-brand-borderSubtle" : ""
                }`}
              >
                <div className="font-body text-[13px] text-brand-text font-medium truncate">{sub.email}</div>
                <div className={`font-body text-[13px] ${sub.city === "Chicago" ? "text-brand-text" : "text-brand-textMuted"}`}>
                  {sub.city || "—"}
                </div>
                <div className="font-body text-xs text-brand-textMuted">{sub.frequency}</div>
                <div className="font-body text-xs text-brand-textSec">{sub.title || "—"}</div>
                <div className="font-body text-xs text-brand-textMuted">
                  {sub.joined ? new Date(sub.joined).toLocaleDateString() : "—"}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={exportCSV}
          className="font-display text-xs font-bold px-[18px] py-2 rounded-md border-[1.5px] border-brand-border bg-white text-brand-text"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
