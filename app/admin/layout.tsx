"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "submissions", label: "Submissions", href: "/admin/submissions" },
  { key: "subscribers", label: "Subscribers", href: "/admin/subscribers" },
  { key: "events", label: "Events", href: "/admin/events" },
  { key: "photos", label: "Photos", href: "/admin/photos" },
  { key: "settings", label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-53px)]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-[220px]" : "w-0 overflow-hidden"} shrink-0 border-r border-brand-borderSubtle bg-brand-surfaceAlt transition-all hidden md:block`}>
        <div className="p-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-white font-semibold text-brand-text shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    : "text-brand-textSec hover:bg-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Live counter widget */}
        <div className="mx-3 mt-4 p-3.5 rounded-lg bg-[rgba(45,95,45,0.06)] border border-[rgba(45,95,45,0.15)]">
          <div className="font-display text-[10px] font-bold text-brand-highlight tracking-[0.06em] uppercase mb-1">
            Live Counter
          </div>
          <div className="font-display text-[26px] font-extrabold text-brand-highlight" id="admin-counter">
            —
          </div>
          <div className="font-body text-[11px] text-brand-textSec">CISOs subscribed</div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden border-b border-brand-borderSubtle bg-brand-surfaceAlt px-4 py-2 flex gap-2 overflow-x-auto fixed top-[53px] left-0 right-0 z-40">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold ${
                active ? "bg-white text-brand-text shadow-sm" : "text-brand-textMuted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-7 max-w-[900px] md:mt-0 mt-10">
        {children}
      </div>
    </div>
  );
}
