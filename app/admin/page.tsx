"use client";

import { useState, useEffect } from "react";

interface DashboardData {
  totalSubscribers: number;
  chicagoSubscribers: number;
  waitlistSubscribers: number;
  publishedEvents: number;
  pendingSubmissions: number;
  pastEvents: number;
  photosEnabled: boolean;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [photosEnabled, setPhotosEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all stats in parallel
        const [subRes, evRes, pendRes] = await Promise.all([
          fetch("/api/admin/subscribers"),
          fetch("/api/admin/events?city=chicago"),
          fetch("/api/admin/submissions?status=pending"),
        ]);

        const [subData, evData, pendData] = await Promise.all([
          subRes.json(), evRes.json(), pendRes.json(),
        ]);

        const subs = subData.subscribers || [];
        const events = evData.events || [];
        const chicagoSubs = subs.filter((s: any) => s.city === "Chicago" && s.is_active);
        const waitlistSubs = subs.filter((s: any) => s.city !== "Chicago" && s.is_active);

        setData({
          totalSubscribers: subData.active || subs.filter((s: any) => s.is_active).length,
          chicagoSubscribers: chicagoSubs.length,
          waitlistSubscribers: waitlistSubs.length,
          publishedEvents: events.filter((e: any) => e.status === "published").length,
          pendingSubmissions: (pendData.submissions || []).length,
          pastEvents: events.filter((e: any) => e.status === "past").length,
          photosEnabled: false,
        });

        // Update sidebar counter
        const counter = document.getElementById("admin-counter");
        if (counter) counter.textContent = String(subData.active || subs.length);
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function togglePhotos() {
    setPhotosEnabled(!photosEnabled);
    // In production: POST to /api/admin/settings to persist this
  }

  if (loading) {
    return <div className="py-20 text-center text-brand-textMuted text-sm">Loading dashboard...</div>;
  }

  const metrics = [
    { label: "Total Subscribers", value: data?.totalSubscribers || 0, color: "text-brand-highlight" },
    { label: "Chicago Subscribers", value: data?.chicagoSubscribers || 0, color: "text-[#25508C]" },
    { label: "Waitlist (Other Cities)", value: data?.waitlistSubscribers || 0, color: "text-brand-textSec" },
    { label: "Published Events", value: data?.publishedEvents || 0, color: "text-brand-highlight" },
    { label: "Pending Submissions", value: data?.pendingSubmissions || 0, color: "text-[#B44D1E]" },
    { label: "Past Events", value: data?.pastEvents || 0, color: "text-brand-textMuted" },
  ];

  return (
    <div>
      <h2 className="font-display text-[22px] font-extrabold tracking-tight mb-1.5">Dashboard</h2>
      <p className="font-body text-sm text-brand-textMuted mb-6">EventList admin overview — Chicago launch</p>

      {/* Metric Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="p-[18px] rounded-[10px] bg-white border border-brand-borderSubtle shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="font-body text-xs text-brand-textMuted mb-2">{m.label}</div>
            <div className={`font-display text-[28px] font-extrabold tracking-tight ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Subscriber Counter */}
      <div className="p-[18px_20px] rounded-[10px] bg-[rgba(45,95,45,0.06)] border border-[rgba(45,95,45,0.15)] mb-4 flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="font-display text-sm font-bold text-brand-text mb-0.5">Public Subscriber Counter</div>
          <div className="font-body text-[13px] text-brand-textSec">
            Showing <strong>{data?.totalSubscribers || 0} CISOs subscribed</strong> on the Chicago city page. Auto-updating.
          </div>
        </div>
        <div className="font-display text-[32px] font-extrabold text-brand-highlight bg-white px-5 py-2 rounded-lg border border-[rgba(45,95,45,0.15)]">
          {data?.totalSubscribers || 0}
        </div>
      </div>

      {/* Photo Gallery Toggle */}
      <div className="p-[18px_20px] rounded-[10px] bg-white border border-brand-borderSubtle flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="font-display text-sm font-bold text-brand-text mb-0.5">Photo Gallery Visibility</div>
          <div className="font-body text-[13px] text-brand-textSec">
            Toggle "You Missed It" and "Photo Gallery" sections on the public site.
            {!photosEnabled && " Currently hidden."}
          </div>
        </div>
        <button
          onClick={togglePhotos}
          className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${
            photosEnabled ? "bg-brand-highlight" : "bg-gray-300"
          }`}
        >
          <div className={`w-[22px] h-[22px] rounded-full bg-white absolute top-[3px] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.15)] ${
            photosEnabled ? "left-[23px]" : "left-[3px]"
          }`} />
        </button>
      </div>
    </div>
  );
}
