"use client";

import { useState } from "react";
import Link from "next/link";

const EVENT_TYPES = ["Dinner", "Half-day", "Conference", "Full-day", "Multi-day"];

export default function SubmitPage() {
  const [form, setForm] = useState({
    title: "", date: "", city: "Chicago", type: "", organizer: "",
    venue: "", external_url: "", invite_only: false, description: "",
    submitter_email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrors([]);

    try {
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Event submitted for review!");
        setForm({
          title: "", date: "", city: "Chicago", type: "", organizer: "",
          venue: "", external_url: "", invite_only: false, description: "",
          submitter_email: "",
        });
      } else {
        setStatus("error");
        setMessage(data.error || "Validation failed.");
        setErrors(data.errors || []);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-white border-[1.5px] border-brand-borderSubtle text-sm text-brand-text font-body";
  const labelClass = "block font-display text-[11px] font-bold text-brand-textMuted mb-1.5 tracking-[0.05em] uppercase";

  return (
    <div className="max-w-[540px] mx-auto pt-9 px-6 pb-12">
      <Link href="/" className="font-body text-xs text-brand-textMuted font-medium mb-5 block">
        ← Back
      </Link>

      <h1 className="font-display text-[28px] font-extrabold tracking-tight mb-1.5">
        Submit an Event
      </h1>
      <p className="font-body text-sm text-brand-textSec mb-7">
        Free to list. Takes 60 seconds. We review every submission.
      </p>

      {status === "success" && (
        <div className="toast mb-6 p-4 rounded-lg bg-[rgba(45,95,45,0.06)] border border-[rgba(45,95,45,0.15)] text-sm text-brand-highlight font-medium">
          ✓ {message}
        </div>
      )}
      {status === "error" && (
        <div className="toast mb-6 p-4 rounded-lg bg-[rgba(180,77,30,0.06)] border border-[rgba(180,77,30,0.16)] text-sm text-[#B44D1E]">
          <p className="font-medium mb-1">{message}</p>
          {errors.length > 0 && (
            <ul className="list-disc list-inside text-xs mt-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-[18px]">
        <div>
          <label className={labelClass}>Event Name *</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Chicago CISO Dinner" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Date *</label>
          <input required type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input disabled value="Chicago" className={`${inputClass} bg-brand-surfaceAlt text-brand-textMuted`} />
        </div>

        <div>
          <label className={labelClass}>Event Type *</label>
          <select required value={form.type} onChange={(e) => update("type", e.target.value)} className={inputClass}>
            <option value="">Select type...</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Venue</label>
          <input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Venue name and address" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Organizer *</label>
          <input required value={form.organizer} onChange={(e) => update("organizer", e.target.value)} placeholder="Your organization name" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Registration Link</label>
          <input type="url" value={form.external_url} onChange={(e) => update("external_url", e.target.value)} placeholder="https://..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Your Email (for notifications)</label>
          <input type="email" value={form.submitter_email} onChange={(e) => update("submitter_email", e.target.value)} placeholder="you@company.com" className={inputClass} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => update("invite_only", !form.invite_only)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              form.invite_only ? "bg-brand-highlight" : "bg-gray-300"
            }`}
          >
            <div className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${
              form.invite_only ? "left-[21px]" : "left-[3px]"
            }`} />
          </button>
          <label className="font-body text-sm text-brand-textSec">Invite only</label>
        </div>

        <div>
          <label className={labelClass}>Short Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="1-2 sentences about the event"
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full font-display text-sm font-bold py-3.5 rounded-lg bg-brand-text text-white mt-2 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit for Review"}
        </button>
      </form>

      <p className="font-body text-xs text-brand-textMuted text-center mt-2.5">
        Events are reviewed within 24 hours.
      </p>
    </div>
  );
}
