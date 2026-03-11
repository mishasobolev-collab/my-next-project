import { useState } from "react";

const C = {
  bg: "#FAFAF9", surface: "#FFFFFF", surfaceAlt: "#F5F5F3",
  card: "#FFFFFF", border: "#E5E5E3", borderSubtle: "#EDEDEB",
  text: "#1A1A1A", textSec: "#525252", textMuted: "#8C8C8C",
  highlight: "#2D5F2D", highlightSoft: "rgba(45,95,45,0.06)", highlightBorder: "rgba(45,95,45,0.15)",
  warm: "#B44D1E", warmSoft: "rgba(180,77,30,0.06)", warmBorder: "rgba(180,77,30,0.16)",
  badge: {
    dinner: { bg: "rgba(45,95,45,0.07)", text: "#2D5F2D", border: "rgba(45,95,45,0.18)" },
    conference: { bg: "rgba(37,80,140,0.07)", text: "#25508C", border: "rgba(37,80,140,0.18)" },
    halfday: { bg: "rgba(160,110,20,0.07)", text: "#8C6A14", border: "rgba(160,110,20,0.18)" },
    inviteOnly: { bg: "rgba(180,77,30,0.06)", text: "#B44D1E", border: "rgba(180,77,30,0.16)" },
  },
};
const fn = { d: "'Montserrat', sans-serif", b: "'DM Sans', sans-serif" };
const BRAND = "EventList";

// All 23 events from Chicago_events.xlsx, split at March 10 2026
const UPCOMING = [
  { id: 1, title: "Chicago CISO Dinner", date: "Mar 10", month: "Mar", type: "Dinner", organizer: "CyberRisk Alliance", venue: "The Gage, 24 S Michigan Ave, Chicago", inviteOnly: true, url: "https://events.cyberriskcollaborative.com/March-2026-Chicago-CISO-Dinner" },
  { id: 2, title: "CISO, Chicago Evening Gathering", date: "Apr 2", month: "Apr", type: "Dinner", organizer: "GBI", venue: "Not disclosed", inviteOnly: true, url: "https://www.gbiimpact.com/evening-gatherings/ciso-chicago-evening-gathering" },
  { id: 3, title: "CIO & CISO Think Tank", date: "Apr 9", month: "Apr", type: "Conference", organizer: "C-Vision", venue: "Not disclosed", inviteOnly: true, url: "https://www.cvisionintl.com/events/think-tank/2026-apr-9-cio-ciso-tt-chicago/" },
  { id: 4, title: "Executive Dinner (Island)", date: "Apr 9", month: "Apr", type: "Dinner", organizer: "C-Vision", venue: "Not disclosed", inviteOnly: true, url: "https://www.cvisionintl.com/events/dinner/2026-apr-9-island-dinner-chicago/" },
  { id: 5, title: "Executive Dinner (Fortinet)", date: "Apr 9", month: "Apr", type: "Dinner", organizer: "C-Vision", venue: "Not disclosed", inviteOnly: true, url: "https://www.cvisionintl.com/events/dinner/2026-apr-9-fortinet-dinner-chicago/" },
  { id: 6, title: "CISO Chicago Summit", date: "Apr 16", month: "Apr", type: "Conference", organizer: "CDM Media", venue: "Not disclosed", inviteOnly: true, url: "https://events.cdmmedia.com/event/9e7a6525-b47d-4fdb-85b6-bfe849a7608c/summary" },
  { id: 7, title: "CISO Chicago 2026", date: "Apr 28", month: "Apr", type: "Conference", organizer: "Corinium", venue: "Hyatt Regency McCormick Place", inviteOnly: false, url: "https://ciso-chicago.coriniumintelligence.com/" },
  { id: 8, title: "Aphinia CISO Mastermind Dinner", date: "May 6", month: "May", type: "Dinner", organizer: "Aphinia", venue: "Private venue", inviteOnly: true, url: "https://luma.com/nlykojh6" },
  { id: 9, title: "Orbie Awards", date: "May 7", month: "May", type: "Conference", organizer: "Orbie Awards", venue: "Chicago Marriott Downtown Magnificent Mile", inviteOnly: false, url: "https://chicagociso.co/awards" },
  { id: 10, title: "Chicago CISO Community Executive Summit", date: "May 13", month: "May", type: "Conference", organizer: "Evanta", venue: "Convene at Willis Tower", inviteOnly: true, url: "https://www.evanta.com/ciso/chicago/chicago-ciso-executive-summit-8446" },
  { id: 11, title: "Chicago CISO Roundtable", date: "May 19", month: "May", type: "Conference", organizer: "IANS Research", venue: "Omni Chicago Hotel, 676 N Michigan Ave", inviteOnly: true, url: "https://www.iansresearch.com/what-we-do/events/roundtables/details/2026/05/19/2026-ciso-roundtable/2026-chicago-ciso-roundtable" },
  { id: 12, title: "SecureWorld Chicago", date: "May 20", month: "May", type: "Conference", organizer: "SecureWorld", venue: "Donald E. Stephens Convention Center, Rosemont", inviteOnly: false, url: "https://events.secureworld.io/details/chicago-il-2026/" },
  { id: 13, title: "CISO Dinner", date: "Jun 4", month: "Jun", type: "Dinner", organizer: "Elite B2B Events", venue: "The Wade", inviteOnly: true, url: "https://www.eliteb2bevents.com/register/eliteciochicago/2026-06-02" },
  { id: 14, title: "Collaborating — Chicago CISO Community", date: "Aug 6", month: "Aug", type: "Half-day", organizer: "CISO Meet", venue: "Fogo de Chão, Rosemont", inviteOnly: false, url: "https://www.cisomeetchicago.org/" },
  { id: 15, title: "Chicago CISO Dinner", date: "Aug 18", month: "Aug", type: "Dinner", organizer: "CyberRisk Alliance", venue: "Not disclosed", inviteOnly: true, url: "https://www.cyberriskalliance.com/upcoming-events" },
  { id: 16, title: "Chicago CISO Community Inner Circle", date: "Sep 2", month: "Sep", type: "Dinner", organizer: "Evanta", venue: "The Metropolitan", inviteOnly: true, url: "https://www.evanta.com/ciso/chicago/chicago-ciso-inner-circle-9279" },
  { id: 17, title: "Cybersecurity Summit — Chicago", date: "Sep 15", month: "Sep", type: "Conference", organizer: "CyberRisk Alliance", venue: "Not disclosed", inviteOnly: false, url: "https://www.cyberriskalliance.com/upcoming-events" },
  { id: 18, title: "Chicago CISO Dinner", date: "Nov 11", month: "Nov", type: "Dinner", organizer: "CyberRisk Alliance", venue: "Not disclosed", inviteOnly: true, url: "https://www.cyberriskalliance.com/upcoming-events" },
  { id: 19, title: "Chicago CISO Community Executive Summit", date: "Dec 2", month: "Dec", type: "Conference", organizer: "Evanta", venue: "Convene at Willis Tower", inviteOnly: true, url: "https://www.evanta.com/ciso/chicago/chicago-ciso-executive-summit-9281" },
];

const PAST = [
  { id: 20, title: "CISO XC — Chicago", date: "Sep 4, 2025", month: "Sep", type: "Conference", organizer: "CISO XC", venue: "Not disclosed", inviteOnly: false, photoCount: 0 },
  { id: 21, title: "Chicago Cybersecurity Conference", date: "Jan 29", month: "Jan", type: "Conference", organizer: "FutureCon", venue: "Oak Brook, IL", inviteOnly: false, photoCount: 0 },
  { id: 22, title: "Chicago — Official Cybersecurity Summit", date: "Mar 3", month: "Mar", type: "Conference", organizer: "CyberRisk Alliance", venue: "Hyatt Regency, 151 E Wacker Dr", inviteOnly: false, photoCount: 0 },
  { id: 23, title: "CIO / CISO Transformation Roadshow Dinner", date: "Mar 4", month: "Mar", type: "Dinner", organizer: "Apex", venue: "Not disclosed", inviteOnly: true, photoCount: 0 },
];

const ALL_EVENTS = [...UPCOMING.map(e => ({ ...e, status: "upcoming" })), ...PAST.map(e => ({ ...e, status: "past" }))];
const WAITLIST_CITIES = ["New York", "Washington DC", "San Francisco", "Boston", "Dallas", "Houston", "Atlanta", "Seattle"];

// Photo gallery feature flag — off at launch
const PHOTOS_ENABLED = false;

const Badge = ({ type, inviteOnly }) => {
  const config = type === "Dinner" ? C.badge.dinner : type === "Half-day" ? C.badge.halfday : C.badge.conference;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 10.5, fontFamily: fn.b, fontWeight: 600, padding: "3px 9px", borderRadius: 4, background: config.bg, color: config.text, border: `1px solid ${config.border}`, letterSpacing: "0.04em", textTransform: "uppercase" }}>{type}</span>
      {inviteOnly && <span style={{ fontSize: 10.5, fontFamily: fn.b, fontWeight: 600, padding: "3px 9px", borderRadius: 4, background: C.badge.inviteOnly.bg, color: C.badge.inviteOnly.text, border: `1px solid ${C.badge.inviteOnly.border}`, letterSpacing: "0.04em", textTransform: "uppercase" }}>Invite Only</span>}
    </div>
  );
};

const Logo = ({ size = 18, onClick }) => (
  <div onClick={onClick} style={{ fontFamily: fn.d, fontSize: size, fontWeight: 800, color: C.text, cursor: onClick ? "pointer" : "default", letterSpacing: "-0.03em" }}>
    Event<span style={{ color: C.highlight }}>List</span>
  </div>
);

// ─── HOMEPAGE ─────────────────────────────────────────
const HomePage = ({ nav }) => (
  <div>
    <div style={{ padding: "72px 24px 56px", textAlign: "center", background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)", borderBottom: `1px solid ${C.borderSubtle}` }}>
      <div style={{ fontFamily: fn.b, fontSize: 11, letterSpacing: "0.14em", color: C.highlight, textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>Now live in Chicago</div>
      <h1 style={{ fontFamily: fn.d, fontSize: "clamp(30px, 5.5vw, 50px)", fontWeight: 800, color: C.text, lineHeight: 1.12, margin: "0 auto 18px", maxWidth: 560, letterSpacing: "-0.03em" }}>
        Where CISOs Find Trusted Rooms
      </h1>
      <p style={{ fontFamily: fn.b, fontSize: 16, color: C.textSec, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.6 }}>
        Private dinners. Executive roundtables. Curated summits. Discover the events that matter in your city.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => nav("city")} style={{ fontFamily: fn.d, fontSize: 14, fontWeight: 700, padding: "13px 28px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Browse Chicago Events →</button>
        <button onClick={() => nav("subscribe")} style={{ fontFamily: fn.d, fontSize: 14, fontWeight: 600, padding: "13px 28px", borderRadius: 8, cursor: "pointer", background: "transparent", color: C.text, border: `1.5px solid ${C.border}` }}>Subscribe to Updates</button>
      </div>
    </div>

    <div style={{ display: "flex", justifyContent: "center", gap: 48, padding: "28px 24px", borderBottom: `1px solid ${C.borderSubtle}`, flexWrap: "wrap" }}>
      {[{ n: "23", l: "Chicago events tracked" }, { n: "15", l: "organizers listed" }, { n: "8", l: "cities on waitlist" }].map((s, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: fn.d, fontSize: 26, color: C.text, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.n}</div>
          <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.l}</div>
        </div>
      ))}
    </div>

    <div style={{ padding: "44px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <h2 style={{ fontFamily: fn.d, fontSize: 20, color: C.text, margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}>Coming Up in Chicago</h2>
        <button onClick={() => nav("city")} style={{ fontFamily: fn.b, fontSize: 13, color: C.highlight, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
      </div>
      {UPCOMING.slice(0, 5).map(ev => (
        <div key={ev.id} onClick={() => nav("event", ev)} style={{ padding: "15px 0", borderBottom: `1px solid ${C.borderSubtle}`, cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ fontFamily: fn.b, fontSize: 12, color: C.highlight, fontWeight: 600, minWidth: 52, paddingTop: 2 }}>{ev.date}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fn.b, fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 5 }}>{ev.title}</div>
            <Badge type={ev.type} inviteOnly={ev.inviteOnly} />
          </div>
          <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, textAlign: "right", minWidth: 70 }}>{ev.organizer}</div>
        </div>
      ))}
    </div>

    {/* FOMO Gallery — only if enabled */}
    {PHOTOS_ENABLED && PAST.some(e => e.photoCount > 0) && (
      <div style={{ padding: "44px 24px", borderTop: `1px solid ${C.borderSubtle}`, background: C.surfaceAlt }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontFamily: fn.d, fontSize: 20, color: C.text, margin: "0 0 6px", fontWeight: 700 }}>You Missed It</h2>
          <p style={{ fontFamily: fn.b, fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Recent events. Subscribe so you don't miss the next one.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {PAST.filter(e => e.photoCount > 0).map(ev => (
              <div key={ev.id} onClick={() => nav("pastEvent", ev)} style={{ background: C.card, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.borderSubtle}`, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ height: 110, background: "linear-gradient(135deg, #E8E8E4, #D8D8D4)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: 28, opacity: 0.3 }}>📸</span>
                  <div style={{ position: "absolute", bottom: 8, right: 8, fontFamily: fn.b, fontSize: 10, color: C.textSec, fontWeight: 600, background: "rgba(255,255,255,0.85)", padding: "2px 7px", borderRadius: 4 }}>{ev.photoCount} photos</div>
                </div>
                <div style={{ padding: "11px 13px" }}>
                  <div style={{ fontFamily: fn.b, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>{ev.title}</div>
                  <div style={{ fontFamily: fn.b, fontSize: 11, color: C.textMuted }}>{ev.date} · {ev.organizer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    <div style={{ padding: "44px 24px", borderTop: `1px solid ${C.borderSubtle}` }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: fn.d, fontSize: 20, color: C.text, margin: "0 0 6px", fontWeight: 700 }}>Coming Soon</h2>
        <p style={{ fontFamily: fn.b, fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Get notified when we launch in your city.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
          {WAITLIST_CITIES.map((city, i) => (
            <button key={i} onClick={() => nav("subscribe")} style={{ padding: "13px 16px", borderRadius: 8, cursor: "pointer", background: C.card, border: `1px solid ${C.borderSubtle}`, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <span style={{ fontFamily: fn.b, fontSize: 14, color: C.text, fontWeight: 500 }}>{city}</span>
              <span style={{ fontSize: 12, color: C.textMuted }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    <div style={{ padding: "44px 24px", borderTop: `1px solid ${C.borderSubtle}`, background: C.surfaceAlt }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: fn.d, fontSize: 20, color: C.text, margin: "0 0 24px", fontWeight: 700 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { label: "For CISOs", text: "Browse curated, senior-level cybersecurity events in your city. Subscribe once and get a digest — no noise, no vendor spam." },
            { label: "For Organizers", text: "Get your event in front of the right audience — free. Submit in 60 seconds and reach CISOs actively looking for what you're hosting." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "22px", borderRadius: 10, background: C.card, border: `1px solid ${C.borderSubtle}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily: fn.d, fontSize: 12, color: C.highlight, marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec, lineHeight: 1.65 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── CITY PAGE ────────────────────────────────────────
const CityPage = ({ nav }) => {
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("upcoming");
  const types = ["All", "Dinner", "Conference", "Half-day"];
  const filtered = filter === "All" ? UPCOMING : UPCOMING.filter(e => e.type === filter);
  const photoPast = PAST.filter(e => e.photoCount > 0);

  return (
    <div>
      <div style={{ padding: "36px 24px 28px", borderBottom: `1px solid ${C.borderSubtle}`, background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <button onClick={() => nav("home")} style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, fontWeight: 500, background: "none", border: "none", cursor: "pointer", marginBottom: 14, padding: 0 }}>← {BRAND}</button>
          <h1 style={{ fontFamily: fn.d, fontSize: "clamp(26px, 5vw, 38px)", color: C.text, margin: "0 0 10px", fontWeight: 800, letterSpacing: "-0.03em" }}>Chicago</h1>
          <p style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec, margin: "0 0 18px" }}>Cybersecurity events for senior executives</p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 18 }}>
            {[{ n: UPCOMING.length, l: "upcoming" }, { n: UPCOMING.filter(e => e.type === "Dinner").length, l: "dinners" }, { n: "47", l: "CISOs subscribed" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontFamily: fn.d, fontSize: 22, color: C.text, fontWeight: 800 }}>{s.n}</span>
                <span style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted }}>{s.l}</span>
              </div>
            ))}
          </div>
          <button onClick={() => nav("subscribe")} style={{ fontFamily: fn.d, fontSize: 13, fontWeight: 700, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Subscribe to Chicago</button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        {/* Tabs — photo gallery only if enabled */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.borderSubtle}`, marginBottom: 18 }}>
          <button onClick={() => setTab("upcoming")} style={{ fontFamily: fn.d, fontSize: 12, fontWeight: 600, padding: "15px 18px", background: "none", border: "none", cursor: "pointer", color: tab === "upcoming" ? C.text : C.textMuted, borderBottom: tab === "upcoming" ? `2px solid ${C.text}` : "2px solid transparent" }}>Upcoming ({UPCOMING.length})</button>
          {PHOTOS_ENABLED && photoPast.length > 0 && (
            <button onClick={() => setTab("past")} style={{ fontFamily: fn.d, fontSize: 12, fontWeight: 600, padding: "15px 18px", background: "none", border: "none", cursor: "pointer", color: tab === "past" ? C.text : C.textMuted, borderBottom: tab === "past" ? `2px solid ${C.text}` : "2px solid transparent" }}>Photo Gallery ({photoPast.length})</button>
          )}
        </div>

        {tab === "upcoming" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {types.map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: fn.b, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6, cursor: "pointer", background: filter === t ? "rgba(26,26,26,0.05)" : "transparent", color: filter === t ? C.text : C.textMuted, border: `1px solid ${filter === t ? C.border : C.borderSubtle}` }}>
                  {t}{t !== "All" && <span style={{ marginLeft: 5, opacity: 0.5 }}>{UPCOMING.filter(e => e.type === t).length}</span>}
                </button>
              ))}
              <button style={{ fontFamily: fn.b, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6, cursor: "pointer", background: "transparent", color: C.badge.inviteOnly.text, border: `1px solid ${C.badge.inviteOnly.border}` }}>Invite Only</button>
            </div>
            {filtered.map(ev => (
              <div key={ev.id} onClick={() => nav("event", ev)} style={{ padding: "16px 0", borderBottom: `1px solid ${C.borderSubtle}`, cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontFamily: fn.b, fontSize: 12, color: C.highlight, fontWeight: 600, minWidth: 52, paddingTop: 3 }}>{ev.date}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: fn.b, fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 5 }}>{ev.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge type={ev.type} inviteOnly={ev.inviteOnly} />
                    <span style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted }}>· {ev.organizer}</span>
                  </div>
                  <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 5 }}>📍 {ev.venue}</div>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: 36, marginBottom: 24, padding: "18px 20px", borderRadius: 10, background: C.highlightSoft, border: `1px solid ${C.highlightBorder}`, textAlign: "center" }}>
          <div style={{ fontFamily: fn.b, fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 8 }}>Get Chicago events delivered to your inbox</div>
          <button onClick={() => nav("subscribe")} style={{ fontFamily: fn.d, fontSize: 13, fontWeight: 700, padding: "9px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Subscribe Free</button>
        </div>
      </div>
    </div>
  );
};

// ─── EVENT DETAIL ─────────────────────────────────────
const EventDetail = ({ event, nav }) => {
  const [showCard, setShowCard] = useState(false);
  return (
    <div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <button onClick={() => nav("city")} style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "24px 0 14px" }}>← Chicago Events</button>
        <Badge type={event.type} inviteOnly={event.inviteOnly} />
        <h1 style={{ fontFamily: fn.d, fontSize: "clamp(24px, 5vw, 34px)", color: C.text, margin: "10px 0 14px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{event.title}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
          <div style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec }}><span style={{ color: C.highlight, fontWeight: 600 }}>{event.date}, 2026</span><span style={{ margin: "0 8px", color: C.borderSubtle }}>|</span>Chicago</div>
          <div style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec }}>Hosted by <span style={{ color: C.text, fontWeight: 500 }}>{event.organizer}</span></div>
          <div style={{ fontFamily: fn.b, fontSize: 14, color: C.textMuted }}>📍 {event.venue}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28, padding: "18px", borderRadius: 10, background: C.surfaceAlt, border: `1px solid ${C.borderSubtle}` }}>
          <button onClick={() => window.open(event.url, "_blank")} style={{ flex: "1 1 auto", fontFamily: fn.d, fontSize: 13, fontWeight: 700, padding: "11px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>View Details & RSVP ↗</button>
          <button onClick={() => setShowCard(!showCard)} style={{ flex: "1 1 auto", fontFamily: fn.d, fontSize: 13, fontWeight: 700, padding: "11px 22px", borderRadius: 8, cursor: "pointer", background: showCard ? "rgba(10,102,194,0.08)" : "transparent", color: showCard ? "#1A6DC2" : C.text, border: `1.5px solid ${showCard ? "rgba(10,102,194,0.25)" : C.border}` }}>{showCard ? "✓ " : ""}I'm Attending — Share on LinkedIn</button>
        </div>

        {showCard && (
          <div style={{ marginBottom: 28, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(10,102,194,0.15)", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", animation: "fadeIn 0.25s ease" }}>
            <div style={{ padding: "28px 24px", textAlign: "center", background: "linear-gradient(180deg, #F8FAFC, #fff)" }}>
              <div style={{ fontFamily: fn.d, fontSize: 10, letterSpacing: "0.16em", color: C.textMuted, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>eventlist.io</div>
              <div style={{ fontFamily: fn.d, fontSize: 20, color: C.text, fontWeight: 800, lineHeight: 1.2, marginBottom: 10, letterSpacing: "-0.02em" }}>{event.title}</div>
              <div style={{ fontFamily: fn.b, fontSize: 13, color: C.textSec, marginBottom: 14 }}>{event.date}, 2026 · Chicago</div>
              <div style={{ display: "inline-block", padding: "7px 18px", borderRadius: 6, background: C.highlightSoft, border: `1px solid ${C.highlightBorder}`, fontFamily: fn.d, fontSize: 12, color: C.highlight, fontWeight: 700 }}>I'm Attending ✓</div>
            </div>
            <div style={{ padding: "11px 24px", borderTop: `1px solid ${C.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: fn.b, fontSize: 10, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Powered by {BRAND}</span>
              <button style={{ fontFamily: fn.d, fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "#0A66C2", color: "#fff" }}>Share on LinkedIn</button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: fn.d, fontSize: 16, color: C.text, margin: "0 0 10px", fontWeight: 700 }}>About This Event</h3>
          <p style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec, lineHeight: 1.7 }}>
            {event.inviteOnly
              ? `An exclusive, invite-only ${event.type.toLowerCase()} for senior cybersecurity executives in the Chicago area. Hosted by ${event.organizer}, this event brings together CISOs and security leaders for candid peer-level conversation.`
              : `A ${event.type.toLowerCase()} for cybersecurity professionals hosted by ${event.organizer} in Chicago. Open to qualified security executives and practitioners.`}
          </p>
        </div>

        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: fn.d, fontSize: 16, color: C.text, margin: "0 0 14px", fontWeight: 700 }}>More Chicago Events</h3>
          {UPCOMING.filter(e => e.id !== event.id).slice(0, 3).map(e => (
            <div key={e.id} onClick={() => nav("event", e)} style={{ padding: "11px 0", borderBottom: `1px solid ${C.borderSubtle}`, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontFamily: fn.b, fontSize: 12, color: C.highlight, fontWeight: 600, minWidth: 48 }}>{e.date}</span>
              <span style={{ fontFamily: fn.b, fontSize: 14, color: C.text, fontWeight: 500 }}>{e.title}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "22px", borderRadius: 10, background: C.highlightSoft, border: `1px solid ${C.highlightBorder}`, textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: fn.b, fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 8 }}>Never miss a Chicago event</div>
          <button onClick={() => nav("subscribe")} style={{ fontFamily: fn.d, fontSize: 13, fontWeight: 700, padding: "9px 22px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

// ─── SUBMIT ───────────────────────────────────────────
const SubmitPage = ({ nav }) => (
  <div style={{ maxWidth: 540, margin: "0 auto", padding: "36px 24px" }}>
    <button onClick={() => nav("home")} style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, fontWeight: 500, background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>← Back</button>
    <h1 style={{ fontFamily: fn.d, fontSize: 28, color: C.text, margin: "0 0 6px", fontWeight: 800, letterSpacing: "-0.02em" }}>Submit an Event</h1>
    <p style={{ fontFamily: fn.b, fontSize: 14, color: C.textSec, marginBottom: 28 }}>Free to list. Takes 60 seconds. We review every submission.</p>
    {[
      { label: "Event Name", ph: "e.g. Chicago CISO Dinner" },
      { label: "Date", ph: "e.g. June 15, 2026" },
      { label: "City", ph: "Chicago", disabled: true },
      { label: "Event Type", ph: "Dinner / Half-day / Full-day / Multi-day" },
      { label: "Venue", ph: "Venue name and address" },
      { label: "Organizer", ph: "Your organization name" },
      { label: "Registration Link", ph: "https://..." },
      { label: "Invite Only?", ph: "Yes / No" },
      { label: "Short Description", ph: "1-2 sentences about the event", ta: true },
    ].map((fld, i) => (
      <div key={i} style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: fn.d, fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>{fld.label}</label>
        {fld.ta ? (
          <textarea placeholder={fld.ph} rows={3} style={{ width: "100%", padding: "10px 13px", borderRadius: 8, background: C.surface, border: `1.5px solid ${C.borderSubtle}`, color: C.text, fontFamily: fn.b, fontSize: 14, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
        ) : (
          <input placeholder={fld.ph} disabled={fld.disabled} style={{ width: "100%", padding: "10px 13px", borderRadius: 8, background: fld.disabled ? C.surfaceAlt : C.surface, border: `1.5px solid ${C.borderSubtle}`, color: fld.disabled ? C.textMuted : C.text, fontFamily: fn.b, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        )}
      </div>
    ))}
    <button style={{ width: "100%", fontFamily: fn.d, fontSize: 14, fontWeight: 700, padding: "13px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff", marginTop: 8 }}>Submit for Review</button>
    <p style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, textAlign: "center", marginTop: 10 }}>Events are reviewed within 24 hours.</p>
  </div>
);

// ─── SUBSCRIBE ────────────────────────────────────────
const SubscribePage = ({ nav }) => {
  const [freq, setFreq] = useState("weekly");
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "52px 24px", textAlign: "center" }}>
      <button onClick={() => nav("home")} style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, fontWeight: 500, background: "none", border: "none", cursor: "pointer", marginBottom: 28, padding: 0 }}>← Back</button>
      <h1 style={{ fontFamily: fn.d, fontSize: 28, color: C.text, margin: "0 0 8px", fontWeight: 800, letterSpacing: "-0.02em" }}>Stay in the Loop</h1>
      <p style={{ fontFamily: fn.b, fontSize: 15, color: C.textSec, marginBottom: 28, lineHeight: 1.6 }}>Only events that matter. Unsubscribe anytime.</p>

      <div style={{ textAlign: "left", marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: fn.d, fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Work Email</label>
        <input placeholder="you@company.com" style={{ width: "100%", padding: "11px 13px", borderRadius: 8, background: C.surface, border: `1.5px solid ${C.borderSubtle}`, color: C.text, fontFamily: fn.b, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
      </div>

      <div style={{ textAlign: "left", marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: fn.d, fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Your City</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {["Chicago", "New York", "DC", "San Francisco", "Boston", "Dallas", "Other"].map(c => (
            <button key={c} style={{ padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontFamily: fn.b, fontSize: 13, fontWeight: 500, background: c === "Chicago" ? C.highlightSoft : "transparent", color: c === "Chicago" ? C.highlight : C.textMuted, border: `1px solid ${c === "Chicago" ? C.highlightBorder : C.borderSubtle}` }}>{c}{c === "Chicago" && " ✓"}</button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "left", marginBottom: 24 }}>
        <label style={{ display: "block", fontFamily: fn.d, fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>How Often</label>
        <div style={{ display: "inline-flex", borderRadius: 8, overflow: "hidden", border: `1.5px solid ${C.borderSubtle}`, background: C.surfaceAlt }}>
          {[{ k: "weekly", l: "Weekly" }, { k: "monthly", l: "Monthly" }].map(o => (
            <button key={o.k} onClick={() => setFreq(o.k)} style={{ padding: "9px 22px", border: "none", cursor: "pointer", fontFamily: fn.d, fontSize: 13, fontWeight: freq === o.k ? 700 : 500, background: freq === o.k ? C.surface : "transparent", color: freq === o.k ? C.text : C.textMuted, boxShadow: freq === o.k ? "0 1px 3px rgba(0,0,0,0.06)" : "none", transition: "all 0.15s" }}>{o.l}</button>
          ))}
        </div>
        <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 6 }}>
          {freq === "weekly" ? "One email every Monday with that week's events." : "One email on the 1st of each month with the full month ahead."}
        </div>
      </div>

      <button style={{ width: "100%", fontFamily: fn.d, fontSize: 14, fontWeight: 700, padding: "13px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Subscribe</button>
      <p style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 14 }}>No spam, no vendor pitches. Just events.</p>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────
export default function EventListApp() {
  const [page, setPage] = useState("home");
  const [sel, setSel] = useState(null);
  const nav = (t, ev = null) => { setPage(t); if (ev) setSel(ev); window.scrollTo?.(0, 0); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: fn.b }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(45,95,45,0.15); }
        input::placeholder, textarea::placeholder { color: #B0B0B0; }
        input:focus, textarea:focus { border-color: #B0B0B0 !important; }
        button:hover { opacity: 0.88; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 480px) { .nav-lnk { display: none !important; } }
      `}</style>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: `1px solid ${C.borderSubtle}`, position: "sticky", top: 0, background: "rgba(250,250,249,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <Logo size={18} onClick={() => nav("home")} />
        <div className="nav-lnk" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={() => nav("city")} style={{ fontFamily: fn.b, fontSize: 13, color: C.textSec, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>Chicago</button>
          <button onClick={() => nav("submit")} style={{ fontFamily: fn.b, fontSize: 13, color: C.textSec, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>Submit Event</button>
          <button onClick={() => nav("subscribe")} style={{ fontFamily: fn.d, fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>Subscribe</button>
        </div>
      </nav>

      <main>
        {page === "home" && <HomePage nav={nav} />}
        {page === "city" && <CityPage nav={nav} />}
        {page === "event" && sel && <EventDetail event={sel} nav={nav} />}
        {page === "submit" && <SubmitPage nav={nav} />}
        {page === "subscribe" && <SubscribePage nav={nav} />}
      </main>

      <footer style={{ padding: "28px 24px", borderTop: `1px solid ${C.borderSubtle}`, textAlign: "center", marginTop: 36 }}>
        <Logo size={15} />
        <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 6 }}>The cybersecurity event platform for senior executives.</div>
        <div style={{ fontFamily: fn.b, fontSize: 12, color: C.textMuted, marginTop: 10, display: "flex", justifyContent: "center", gap: 16 }}>
          <span style={{ cursor: "pointer" }} onClick={() => nav("city")}>Chicago Events</span>
          <span style={{ cursor: "pointer" }} onClick={() => nav("submit")}>Submit Event</span>
          <span style={{ cursor: "pointer" }} onClick={() => nav("subscribe")}>Subscribe</span>
        </div>
      </footer>
    </div>
  );
}
