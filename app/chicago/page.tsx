"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  title: string;
  slug: string;
  date_display: string;
  type: string;
  organizer: string;
  venue: string;
  invite_only: boolean;
  city_slug: string;
}

function Badge({ type, inviteOnly }: { type: string; inviteOnly: boolean }) {
  const colors: Record<string, string> = {
    Dinner: "bg-[rgba(45,95,45,0.07)] text-[#2D5F2D] border-[rgba(45,95,45,0.18)]",
    Conference: "bg-[rgba(37,80,140,0.07)] text-[#25508C] border-[rgba(37,80,140,0.18)]",
    "Half-day": "bg-[rgba(160,110,20,0.07)] text-[#8C6A14] border-[rgba(160,110,20,0.18)]",
  };
  return (
    <div className="flex gap-1.5 flex-wrap">
      <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${colors[type] || colors.Conference}`}>
        {type}
      </span>
      {inviteOnly && (
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide bg-[rgba(180,77,30,0.06)] text-[#B44D1E] border-[rgba(180,77,30,0.16)]">
          Invite Only
        </span>
      )}
    </div>
  );
}

export default function ChicagoPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState("All");
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events?city=chicago&status=upcoming");
        const data = await res.json();
        setEvents(data.events || []);

        // Get subscriber count
        const subRes = await fetch("/api/admin/subscribers?city=chicago");
        const subData = await subRes.json();
        setSubscriberCount(subData.active || 0);
      } catch (e) {
        console.error("Failed to load events:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const types = ["All", ...Array.from(new Set(events.map((e) => e.type)))];
  const filtered = filter === "All" ? events : events.filter((e) => e.type === filter);
  const dinnerCount = events.filter((e) => e.type === "Dinner").length;

  return (
    <div>
      {/* City Header */}
      <div className="pt-9 pb-7 px-6 border-b border-brand-borderSubtle bg-white">
        <div className="max-w-[700px] mx-auto">
          <Link href="/" className="font-body text-xs text-brand-textMuted font-medium mb-3.5 block">
            ← EventList
          </Link>
          <h1 className="font-display text-[clamp(26px,5vw,38px)] font-extrabold tracking-tight mb-2.5">
            Chicago
          </h1>
          <p className="font-body text-sm text-brand-textSec mb-[18px]">
            Cybersecurity events for senior executives
          </p>
          <div className="flex gap-7 flex-wrap mb-[18px]">
            {[
              { n: events.length, l: "upcoming" },
              { n: dinnerCount, l: "dinners" },
              { n: subscriberCount, l: "CISOs subscribed" },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="font-display text-[22px] font-extrabold">{s.n}</span>
                <span className="font-body text-xs text-brand-textMuted">{s.l}</span>
              </div>
            ))}
          </div>
          <Link
            href="/subscribe"
            className="inline-block font-display text-[13px] font-bold px-[22px] py-2.5 rounded-lg bg-brand-text text-white"
          >
            Subscribe to Chicago
          </Link>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-6">
        {/* Filters */}
        <div className="flex gap-2 my-[18px] flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`font-body text-xs font-semibold px-3.5 py-1.5 rounded-md border transition-colors ${
                filter === t
                  ? "bg-[rgba(26,26,26,0.05)] text-brand-text border-brand-border"
                  : "bg-transparent text-brand-textMuted border-brand-borderSubtle"
              }`}
            >
              {t}
              {t !== "All" && (
                <span className="ml-1.5 opacity-50">{events.filter((e) => e.type === t).length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Event List */}
        {loading ? (
          <div className="py-20 text-center text-brand-textMuted font-body text-sm">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-brand-textMuted font-body text-sm">No events found.</div>
        ) : (
          filtered.map((ev, i) => (
            <Link
              key={i}
              href={`/chicago/${ev.slug}`}
              className="flex gap-4 items-start py-4 border-b border-brand-borderSubtle hover:bg-brand-surfaceAlt/50 -mx-2 px-2 rounded transition-colors"
            >
              <span className="font-body text-xs text-brand-highlight font-semibold min-w-[52px] pt-0.5">
                {ev.date_display}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-body text-[15px] text-brand-text font-medium mb-1.5">{ev.title}</div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge type={ev.type} inviteOnly={ev.invite_only} />
                  <span className="font-body text-xs text-brand-textMuted">· {ev.organizer}</span>
                </div>
                <div className="font-body text-xs text-brand-textMuted mt-1.5">📍 {ev.venue}</div>
              </div>
            </Link>
          ))
        )}

        {/* Subscribe CTA */}
        <div className="mt-9 mb-6 p-[18px_20px] rounded-[10px] bg-[rgba(45,95,45,0.06)] border border-[rgba(45,95,45,0.15)] text-center">
          <p className="font-body text-sm text-brand-text font-medium mb-2">
            Get Chicago events delivered to your inbox
          </p>
          <Link
            href="/subscribe"
            className="inline-block font-display text-[13px] font-bold px-[22px] py-2 rounded-lg bg-brand-text text-white"
          >
            Subscribe Free
          </Link>
        </div>
      </div>
    </div>
  );
}
