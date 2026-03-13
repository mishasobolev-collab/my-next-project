"use client";

import { useState, useEffect } from "react";

export default function AdminPhotos() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/photos");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const withPhotos = events.filter((e) => e.photo_count > 0);
  const needPhotos = events.filter((e) => e.status === "past" && e.photo_count === 0);

  return (
    <div>
      <h2 className="font-display text-[22px] font-extrabold tracking-tight mb-1.5">Photos</h2>
      <p className="font-body text-sm text-brand-textMuted mb-6">Upload event photos. Watermarked with eventlist.io automatically.</p>

      {/* Upload Zone */}
      <div className="p-8 rounded-[10px] text-center border-2 border-dashed border-brand-border bg-brand-surfaceAlt mb-6 cursor-pointer hover:border-brand-highlight/30 transition-colors">
        <div className="text-[28px] mb-2 opacity-40">📸</div>
        <div className="font-display text-sm font-bold text-brand-text mb-1">Upload Photos</div>
        <div className="font-body text-[13px] text-brand-textMuted mb-3">Drag and drop, or click to select. JPG, PNG up to 10MB each.</div>
        <select className="px-3.5 py-2 rounded-md border-[1.5px] border-brand-borderSubtle font-body text-[13px] text-brand-text bg-white cursor-pointer">
          <option>Select event to attach photos to...</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title} — {new Date(e.date).toLocaleDateString()}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-textMuted text-sm">Loading...</div>
      ) : (
        <>
          {/* Events with photos */}
          {withPhotos.length > 0 && (
            <>
              <h3 className="font-display text-[15px] font-bold mb-3">Events with Photos ({withPhotos.length})</h3>
              {withPhotos.map((ev) => (
                <div key={ev.id} className="flex justify-between items-center p-3.5 mb-2 rounded-[10px] bg-white border border-brand-borderSubtle">
                  <div>
                    <div className="font-body text-sm text-brand-text font-medium mb-0.5">{ev.title}</div>
                    <div className="font-body text-xs text-brand-textMuted">{new Date(ev.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <span className="font-display text-[13px] font-bold text-brand-highlight">{ev.photo_count} photos</span>
                    <button className="font-display text-[11px] font-bold px-3 py-1.5 rounded-md border border-brand-borderSubtle bg-white text-brand-textSec">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Events needing photos */}
          <h3 className="font-display text-[15px] font-bold mt-6 mb-3">
            Needs Photos ({needPhotos.length})
          </h3>
          {needPhotos.length === 0 ? (
            <p className="text-sm text-brand-textMuted">No past events without photos.</p>
          ) : (
            needPhotos.map((ev) => (
              <div key={ev.id} className="flex justify-between items-center p-3 mb-1.5 rounded-lg bg-brand-surfaceAlt border border-brand-borderSubtle opacity-80">
                <div>
                  <div className="font-body text-[13px] text-brand-text font-medium">{ev.title}</div>
                  <div className="font-body text-[11px] text-brand-textMuted">{new Date(ev.date).toLocaleDateString()} · {ev.organizer}</div>
                </div>
                <button className="font-display text-[11px] font-bold px-3 py-1.5 rounded-md bg-brand-text text-white">
                  + Upload
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
