"use client";

import { useState } from "react";
import Link from "next/link";

const CITIES = ["Chicago", "New York", "DC", "San Francisco", "Boston", "Dallas", "Other"];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Chicago");
  const [freq, setFreq] = useState<"weekly" | "monthly">("weekly");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, frequency: freq }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || data.errors?.[0] || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="max-w-[460px] mx-auto pt-[52px] px-6 text-center">
      <Link href="/" className="font-body text-xs text-brand-textMuted font-medium mb-7 block">
        ← Back
      </Link>

      <h1 className="font-display text-[28px] font-extrabold tracking-tight mb-2">
        Stay in the Loop
      </h1>
      <p className="font-body text-[15px] text-brand-textSec mb-7 leading-relaxed">
        Only events that matter. Unsubscribe anytime.
      </p>

      {/* Toast */}
      {status === "success" && (
        <div className="toast mb-6 p-4 rounded-lg bg-[rgba(45,95,45,0.06)] border border-[rgba(45,95,45,0.15)] text-sm text-brand-highlight font-medium">
          ✓ {message}
        </div>
      )}
      {status === "error" && (
        <div className="toast mb-6 p-4 rounded-lg bg-[rgba(180,77,30,0.06)] border border-[rgba(180,77,30,0.16)] text-sm text-[#B44D1E] font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="text-left">
        {/* Email */}
        <div className="mb-[18px]">
          <label className="block font-display text-[11px] font-bold text-brand-textMuted mb-1.5 tracking-[0.05em] uppercase">
            Work Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3.5 py-[11px] rounded-lg bg-white border-[1.5px] border-brand-borderSubtle text-sm text-brand-text font-body"
          />
        </div>

        {/* City */}
        <div className="mb-[18px]">
          <label className="block font-display text-[11px] font-bold text-brand-textMuted mb-1.5 tracking-[0.05em] uppercase">
            Your City
          </label>
          <div className="flex flex-wrap gap-[7px]">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-3.5 py-[7px] rounded-md text-sm font-medium border transition-colors ${
                  city === c
                    ? "bg-[rgba(45,95,45,0.06)] text-brand-highlight border-[rgba(45,95,45,0.15)]"
                    : "bg-transparent text-brand-textMuted border-brand-borderSubtle"
                }`}
              >
                {c}
                {city === c && " ✓"}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="mb-6">
          <label className="block font-display text-[11px] font-bold text-brand-textMuted mb-1.5 tracking-[0.05em] uppercase">
            How Often
          </label>
          <div className="inline-flex rounded-lg overflow-hidden border-[1.5px] border-brand-borderSubtle bg-brand-surfaceAlt">
            {(["weekly", "monthly"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFreq(opt)}
                className={`px-[22px] py-[9px] font-display text-[13px] border-none transition-all ${
                  freq === opt
                    ? "font-bold bg-white text-brand-text shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                    : "font-medium bg-transparent text-brand-textMuted"
                }`}
              >
                {opt === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-brand-textMuted mt-1.5">
            {freq === "weekly"
              ? "One email every Monday with that week's events."
              : "One email on the 1st of each month with the full month ahead."}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full font-display text-sm font-bold py-3.5 rounded-lg bg-brand-text text-white disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <p className="font-body text-xs text-brand-textMuted mt-3.5">
        No spam, no vendor pitches. Just events.
      </p>
    </div>
  );
}
