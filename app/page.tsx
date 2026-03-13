import Link from "next/link";
import { query } from "@/lib/db";

// Force dynamic rendering (no static cache — events change)
export const dynamic = "force-dynamic";

async function getUpcomingEvents(limit: number = 5) {
  return query(
    `SELECT e.title, e.slug, TO_CHAR(e.date, 'Mon DD') as date_display,
            e.type, e.organizer, e.invite_only, c.slug as city_slug
     FROM events e JOIN cities c ON e.city_id = c.id
     WHERE e.status = 'published' AND e.date >= CURRENT_DATE
     ORDER BY e.date ASC LIMIT $1`,
    [limit]
  );
}

async function getStats() {
  const events = await query("SELECT COUNT(*) as count FROM events WHERE status IN ('published','past')");
  const orgs = await query("SELECT COUNT(DISTINCT organizer) as count FROM events");
  const waitlist = await query("SELECT COUNT(*) as count FROM cities WHERE is_live = FALSE");
  return {
    events: events[0]?.count || 0,
    organizers: orgs[0]?.count || 0,
    waitlistCities: waitlist[0]?.count || 0,
  };
}

async function getWaitlistCities() {
  return query("SELECT name, slug FROM cities WHERE is_live = FALSE ORDER BY name");
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

export default async function HomePage() {
  const [events, stats, waitlistCities] = await Promise.all([
    getUpcomingEvents(5),
    getStats(),
    getWaitlistCities(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="pt-[72px] pb-14 px-6 text-center bg-gradient-to-b from-white to-brand-bg border-b border-brand-borderSubtle">
        <p className="font-body text-[11px] tracking-[0.14em] text-brand-highlight uppercase font-semibold mb-5">
          Now live in Chicago
        </p>
        <h1 className="font-display text-[clamp(30px,5.5vw,50px)] font-extrabold leading-[1.12] tracking-tight max-w-[560px] mx-auto mb-[18px]">
          Where CISOs Find Trusted Rooms
        </h1>
        <p className="font-body text-base text-brand-textSec max-w-[440px] mx-auto mb-8 leading-relaxed">
          Private dinners. Executive roundtables. Curated summits.
          Discover the events that matter in your city.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/chicago" className="font-display text-sm font-bold px-7 py-3 rounded-lg bg-brand-text text-white">
            Browse Chicago Events →
          </Link>
          <Link href="/subscribe" className="font-display text-sm font-semibold px-7 py-3 rounded-lg border-[1.5px] border-brand-border text-brand-text">
            Subscribe to Updates
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="flex justify-center gap-12 py-7 border-b border-brand-borderSubtle flex-wrap px-6">
        {[
          { n: stats.events, l: "Chicago events tracked" },
          { n: stats.organizers, l: "organizers listed" },
          { n: stats.waitlistCities, l: "cities on waitlist" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-[26px] font-extrabold tracking-tight">{s.n}</div>
            <div className="font-body text-xs text-brand-textMuted mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="py-11 px-6 max-w-[700px] mx-auto">
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">Coming Up in Chicago</h2>
          <Link href="/chicago" className="font-body text-sm text-brand-highlight font-semibold">View all →</Link>
        </div>
        {(events as any[]).map((ev, i) => (
          <Link
            key={i}
            href={`/${ev.city_slug}/${ev.slug}`}
            className="flex gap-4 items-start py-[15px] border-b border-brand-borderSubtle hover:bg-brand-surfaceAlt/50 -mx-2 px-2 rounded transition-colors"
          >
            <span className="font-body text-xs text-brand-highlight font-semibold min-w-[52px] pt-0.5">
              {ev.date_display}
            </span>
            <div className="flex-1">
              <div className="font-body text-[15px] text-brand-text font-medium mb-1.5">{ev.title}</div>
              <Badge type={ev.type} inviteOnly={ev.invite_only} />
            </div>
            <span className="font-body text-xs text-brand-textMuted text-right min-w-[70px]">{ev.organizer}</span>
          </Link>
        ))}
      </section>

      {/* Waitlist Cities */}
      <section className="py-11 px-6 border-t border-brand-borderSubtle">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-display text-xl font-bold tracking-tight mb-1.5">Coming Soon</h2>
          <p className="font-body text-sm text-brand-textMuted mb-5">Get notified when we launch in your city.</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-2.5">
            {(waitlistCities as any[]).map((c, i) => (
              <Link key={i} href="/subscribe" className="flex justify-between items-center px-4 py-3 rounded-lg bg-white border border-brand-borderSubtle shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="font-body text-sm text-brand-text font-medium">{c.name}</span>
                <span className="text-xs text-brand-textMuted">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-11 px-6 border-t border-brand-borderSubtle bg-brand-surfaceAlt">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-display text-xl font-bold tracking-tight mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "For CISOs", text: "Browse curated, senior-level cybersecurity events in your city. Subscribe once and get a digest — no noise, no vendor spam." },
              { label: "For Organizers", text: "Get your event in front of the right audience — free. Submit in 60 seconds and reach CISOs actively looking for what you're hosting." },
            ].map((item, i) => (
              <div key={i} className="p-[22px] rounded-[10px] bg-white border border-brand-borderSubtle shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="font-display text-xs text-brand-highlight tracking-[0.08em] uppercase font-bold mb-2.5">{item.label}</div>
                <div className="font-body text-sm text-brand-textSec leading-relaxed">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
