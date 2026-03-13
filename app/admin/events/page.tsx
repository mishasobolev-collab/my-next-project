"use client";

import { useState, useEffect } from "react";

const EVENT_TYPES = ["Dinner", "Half-day", "Conference", "Full-day", "Multi-day"];

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    published: "bg-[rgba(37,80,140,0.07)] text-[#25508C] border-[rgba(37,80,140,0.18)]",
    past: "bg-[rgba(0,0,0,0.04)] text-brand-textMuted border-[rgba(0,0,0,0.08)]",
    draft: "bg-[rgba(251,191,36,0.1)] text-[#92700C] border-[rgba(251,191,36,0.25)]",
  };
  return (
    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${cls[status] || cls.published}`}>
      {status}
    </span>
  );
}

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", date: "", city: "Chicago", type: "", organizer: "",
    venue: "", external_url: "", invite_only: false, description: "",
  });

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events?city=chicago");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Event published!");
        setShowForm(false);
        setForm({ title: "", date: "", city: "Chicago", type: "", organizer: "", venue: "", external_url: "", invite_only: false, description: "" });
        loadEvents();
      } else {
        setMessage(data.error || "Failed to create event.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-md bg-brand-surfaceAlt border-[1.5px] border-brand-borderSubtle text-[13px] text-brand-text font-body";

  return (
    <div>
      <div className="flex justify-between items-start mb-1.5 flex-wrap gap-2">
        <h2 className="font-display text-[22px] font-extrabold tracking-tight">Events</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-display text-xs font-bold px-[18px] py-2 rounded-md bg-brand-text text-white"
        >
          {showForm ? "Cancel" : "+ Add Event Manually"}
        </button>
      </div>
      <p className="font-body text-sm text-brand-textMuted mb-5">All published and past events.</p>

      {message && (
        <div className={`toast mb-4 p-3 rounded-lg text-sm font-medium ${
          message.includes("published") || message.includes("Event published")
            ? "bg-[rgba(45,95,45,0.06)] text-brand-highlight border border-[rgba(45,95,45,0.15)]"
            : "bg-[rgba(180,77,30,0.06)] text-[#B44D1E] border border-[rgba(180,77,30,0.16)]"
        }`}>
          {message}
        </div>
      )}

      {/* Manual Add Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="p-5 rounded-[10px] bg-white border border-brand-borderSubtle shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-5 animate-fadeIn">
          <h3 className="font-display text-[15px] font-bold mb-4">Add Event Manually</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {[
              { key: "title", label: "Event Name", required: true },
              { key: "date", label: "Date", type: "date", required: true },
              { key: "organizer", label: "Organizer", required: true },
              { key: "venue", label: "Venue" },
              { key: "external_url", label: "Registration Link", type: "url" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block font-display text-[10px] font-bold text-brand-textMuted tracking-[0.05em] uppercase mb-1">{f.label}</label>
                <input
                  type={f.type || "text"}
                  required={f.required}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label className="block font-display text-[10px] font-bold text-brand-textMuted tracking-[0.05em] uppercase mb-1">Type</label>
              <select
                required
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select...</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2.5 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="font-display text-xs font-bold px-5 py-2.5 rounded-md bg-brand-highlight text-white disabled:opacity-60"
            >
              {saving ? "Publishing..." : "Publish Event"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="font-display text-xs font-semibold px-5 py-2.5 rounded-md border border-brand-borderSubtle text-brand-textMuted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events Table */}
      {loading ? (
        <div className="py-16 text-center text-brand-textMuted text-sm">Loading...</div>
      ) : (
        <div className="rounded-[10px] overflow-hidden border border-brand-borderSubtle bg-white">
          <div className="hidden sm:grid grid-cols-[2.5fr_1fr_1.2fr_0.8fr_0.6fr] gap-2 px-4 py-2.5 bg-brand-surfaceAlt border-b border-brand-borderSubtle">
            {["Event", "Date", "Organizer", "Status", "Photos"].map((h) => (
              <div key={h} className="font-display text-[10px] font-bold text-brand-textMuted tracking-[0.06em] uppercase">{h}</div>
            ))}
          </div>
          {events.length === 0 ? (
            <div className="py-12 text-center text-brand-textMuted text-sm">No events found.</div>
          ) : (
            events.map((ev: any, i: number) => (
              <div
                key={ev.id}
                className={`grid grid-cols-1 sm:grid-cols-[2.5fr_1fr_1.2fr_0.8fr_0.6fr] gap-1 sm:gap-2 px-4 py-3 items-center ${
                  i < events.length - 1 ? "border-b border-brand-borderSubtle" : ""
                }`}
              >
                <div className="font-body text-[13px] text-brand-text font-medium">{ev.title}</div>
                <div className="font-body text-xs text-brand-textMuted">
                  {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="font-body text-xs text-brand-textSec">{ev.organizer}</div>
                <StatusBadge status={ev.status} />
                <div className={`font-body text-xs ${ev.photo_count > 0 ? "text-brand-highlight" : "text-brand-textMuted"}`}>
                  {ev.photo_count > 0 ? `${ev.photo_count} 📸` : "—"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
