import { useState } from "react";

const C = {
  bg: "#F5F5F3", surface: "#FFFFFF", surfaceAlt: "#FAFAF9",
  border: "#E5E5E3", borderSubtle: "#EDEDEB",
  text: "#1A1A1A", textSec: "#525252", textMuted: "#8C8C8C",
  highlight: "#2D5F2D", highlightSoft: "rgba(45,95,45,0.06)", highlightBorder: "rgba(45,95,45,0.15)",
  warn: "#B44D1E", warnSoft: "rgba(180,77,30,0.06)", warnBorder: "rgba(180,77,30,0.16)",
  blue: "#25508C", blueSoft: "rgba(37,80,140,0.07)", blueBorder: "rgba(37,80,140,0.18)",
  red: "#C53030", redSoft: "rgba(197,48,48,0.06)", redBorder: "rgba(197,48,48,0.16)",
};
const f = { d: "'Montserrat', sans-serif", b: "'DM Sans', sans-serif" };

const MOCK_SUBMISSIONS = [
  { id: "s1", title: "Fortinet CISO Roundtable", date: "Jun 12, 2026", city: "Chicago", type: "Dinner", organizer: "Fortinet", venue: "Gibson's Steakhouse, Chicago", inviteOnly: true, link: "https://fortinet.com/events/chicago-ciso", description: "Intimate dinner for 15 Chicago-area CISOs discussing zero-trust architecture.", submitted: "May 28, 2026", status: "pending" },
  { id: "s2", title: "Midwest Cybersecurity Forum", date: "Jul 9, 2026", city: "Chicago", type: "Conference", organizer: "CyberMidwest", venue: "Hyatt Regency, Chicago", inviteOnly: false, link: "https://cybermidwest.com/forum-2026", description: "Full-day conference focused on critical infrastructure security in the Midwest.", submitted: "May 26, 2026", status: "pending" },
  { id: "s3", title: "CISO Happy Hour — Wrigleyville", date: "Jun 20, 2026", city: "Chicago", type: "Half-day", organizer: "InfoSec Chicago", venue: "The Stretch Bar, Chicago", inviteOnly: false, link: "https://infosecchi.com/happy-hour", description: "Casual networking for security leaders. Walk-ins welcome.", submitted: "May 25, 2026", status: "pending" },
  { id: "s4", title: "Palo Alto Networks Executive Dinner", date: "May 29, 2026", city: "Chicago", type: "Dinner", organizer: "Palo Alto Networks", venue: "Alinea, Chicago", inviteOnly: true, link: "https://paloaltonetworks.com/exec-dinner", description: "Exclusive dinner with Palo Alto Networks leadership.", submitted: "May 20, 2026", status: "approved" },
  { id: "s5", title: "Cloud Security Breakfast", date: "Jun 3, 2026", city: "Chicago", type: "Half-day", organizer: "Wiz", venue: "Soho House Chicago", inviteOnly: true, link: "https://wiz.io/events/chicago", description: "Morning briefing on cloud security posture management.", submitted: "May 18, 2026", status: "rejected" },
];

const MOCK_SUBSCRIBERS = [
  { id: "u1", email: "jchen@acme.com", city: "Chicago", freq: "Weekly", joined: "Apr 2, 2026", title: "CISO" },
  { id: "u2", email: "maria.lopez@bigcorp.io", city: "Chicago", freq: "Weekly", joined: "Apr 5, 2026", title: "VP Security" },
  { id: "u3", email: "d.williams@techstart.co", city: "Chicago", freq: "Monthly", joined: "Apr 8, 2026", title: "Dir. InfoSec" },
  { id: "u4", email: "sarah.k@fortune100.com", city: "Chicago", freq: "Weekly", joined: "Apr 10, 2026", title: "CISO" },
  { id: "u5", email: "rjones@midwest-bank.com", city: "Chicago", freq: "Weekly", joined: "Apr 12, 2026", title: "CISO" },
  { id: "u6", email: "amita.p@healthcare.org", city: "Chicago", freq: "Monthly", joined: "Apr 15, 2026", title: "VP Security" },
  { id: "u7", email: "mike.b@manufacturing.com", city: "New York", freq: "Weekly", joined: "Apr 18, 2026", title: "CISO (waitlist)" },
  { id: "u8", email: "l.zhang@finserv.com", city: "Chicago", freq: "Weekly", joined: "Apr 20, 2026", title: "Dir. Security" },
  { id: "u9", email: "carlos.r@energy.com", city: "DC", freq: "Monthly", joined: "Apr 22, 2026", title: "CISO (waitlist)" },
  { id: "u10", email: "jen.w@saas-co.io", city: "Chicago", freq: "Weekly", joined: "Apr 25, 2026", title: "BISO" },
];

// All 23 events from Chicago_events.xlsx
const MOCK_EVENTS = [
  { id: "e1", title: "CISO XC — Chicago", date: "Sep 4, 2025", organizer: "CISO XC", status: "past", photos: 0 },
  { id: "e2", title: "Chicago Cybersecurity Conference", date: "Jan 29, 2026", organizer: "FutureCon", status: "past", photos: 0 },
  { id: "e3", title: "Chicago — Official Cybersecurity Summit", date: "Mar 3, 2026", organizer: "CyberRisk Alliance", status: "past", photos: 0 },
  { id: "e4", title: "CIO / CISO Transformation Roadshow Dinner", date: "Mar 4, 2026", organizer: "Apex", status: "past", photos: 0 },
  { id: "e5", title: "Chicago CISO Dinner", date: "Mar 10, 2026", organizer: "CyberRisk Alliance", status: "published", photos: 0 },
  { id: "e6", title: "CISO, Chicago Evening Gathering", date: "Apr 2, 2026", organizer: "GBI", status: "published", photos: 0 },
  { id: "e7", title: "CIO & CISO Think Tank", date: "Apr 9, 2026", organizer: "C-Vision", status: "published", photos: 0 },
  { id: "e8", title: "Executive Dinner (Island)", date: "Apr 9, 2026", organizer: "C-Vision", status: "published", photos: 0 },
  { id: "e9", title: "Executive Dinner (Fortinet)", date: "Apr 9, 2026", organizer: "C-Vision", status: "published", photos: 0 },
  { id: "e10", title: "CISO Chicago Summit", date: "Apr 16, 2026", organizer: "CDM Media", status: "published", photos: 0 },
  { id: "e11", title: "CISO Chicago 2026", date: "Apr 28, 2026", organizer: "Corinium", status: "published", photos: 0 },
  { id: "e12", title: "Aphinia CISO Mastermind Dinner", date: "May 6, 2026", organizer: "Aphinia", status: "published", photos: 0 },
  { id: "e13", title: "Orbie Awards", date: "May 7, 2026", organizer: "Orbie Awards", status: "published", photos: 0 },
  { id: "e14", title: "Chicago CISO Community Executive Summit", date: "May 13, 2026", organizer: "Evanta", status: "published", photos: 0 },
  { id: "e15", title: "Chicago CISO Roundtable", date: "May 19, 2026", organizer: "IANS Research", status: "published", photos: 0 },
  { id: "e16", title: "SecureWorld Chicago", date: "May 20, 2026", organizer: "SecureWorld", status: "published", photos: 0 },
  { id: "e17", title: "CISO Dinner", date: "Jun 4, 2026", organizer: "Elite B2B Events", status: "published", photos: 0 },
  { id: "e18", title: "Collaborating — Chicago CISO Community", date: "Aug 6, 2026", organizer: "CISO Meet", status: "published", photos: 0 },
  { id: "e19", title: "Chicago CISO Dinner", date: "Aug 18, 2026", organizer: "CyberRisk Alliance", status: "published", photos: 0 },
  { id: "e20", title: "Chicago CISO Community Inner Circle", date: "Sep 2, 2026", organizer: "Evanta", status: "published", photos: 0 },
  { id: "e21", title: "Cybersecurity Summit — Chicago", date: "Sep 15, 2026", organizer: "CyberRisk Alliance", status: "published", photos: 0 },
  { id: "e22", title: "Chicago CISO Dinner", date: "Nov 11, 2026", organizer: "CyberRisk Alliance", status: "published", photos: 0 },
  { id: "e23", title: "Chicago CISO Community Executive Summit", date: "Dec 2, 2026", organizer: "Evanta", status: "published", photos: 0 },
];

const StatusBadge = ({ status }) => {
  const cfg = { pending: { bg: "rgba(251,191,36,0.1)", text: "#92700C", border: "rgba(251,191,36,0.25)" }, approved: { bg: C.highlightSoft, text: C.highlight, border: C.highlightBorder }, rejected: { bg: C.redSoft, text: C.red, border: C.redBorder }, published: { bg: C.blueSoft, text: C.blue, border: C.blueBorder }, past: { bg: "rgba(0,0,0,0.04)", text: C.textMuted, border: "rgba(0,0,0,0.08)" } }[status] || { bg: "#eee", text: "#666", border: "#ddd" };
  return <span style={{ fontSize: 10.5, fontFamily: f.b, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, textTransform: "uppercase", letterSpacing: "0.04em" }}>{status}</span>;
};

const NavItem = ({ label, count, active, onClick }) => (
  <button onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? C.surface : "transparent", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05)" : "none", fontFamily: f.b, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? C.text : C.textSec, textAlign: "left" }}>
    <span>{label}</span>
    {count !== undefined && <span style={{ fontFamily: f.b, fontSize: 11, fontWeight: 600, color: active ? C.highlight : C.textMuted, background: active ? C.highlightSoft : "rgba(0,0,0,0.04)", padding: "1px 7px", borderRadius: 10 }}>{count}</span>}
  </button>
);

const Toggle = () => {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)} style={{ width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: on ? C.highlight : "#D4D4D4", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  );
};

// ── Pages ──────────────────────────────────────────────
const Dashboard = () => (
  <div>
    <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Dashboard</h2>
    <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 24 }}>EventList admin overview — Chicago launch</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
      {[
        { l: "Total Subscribers", v: "47", d: "+8 this week", c: C.highlight },
        { l: "Chicago Subscribers", v: "38", d: "81% of total", c: C.blue },
        { l: "Waitlist (Other Cities)", v: "9", d: "NYC: 4, DC: 3, SF: 2", c: C.textSec },
        { l: "Published Events", v: "23", d: "Chicago only", c: C.highlight },
        { l: "Pending Submissions", v: "3", d: "Oldest: 3 days ago", c: C.warn },
        { l: "Past Events", v: "4", d: "No photos uploaded yet", c: C.textMuted },
      ].map((m, i) => (
        <div key={i} style={{ padding: "18px", borderRadius: 10, background: C.surface, border: `1px solid ${C.borderSubtle}`, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          <div style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{m.l}</div>
          <div style={{ fontFamily: f.d, fontSize: 28, fontWeight: 800, color: m.c, letterSpacing: "-0.03em" }}>{m.v}</div>
          <div style={{ fontFamily: f.b, fontSize: 11, color: C.textMuted, marginTop: 4 }}>{m.d}</div>
        </div>
      ))}
    </div>
    <div style={{ padding: "18px 20px", borderRadius: 10, background: C.highlightSoft, border: `1px solid ${C.highlightBorder}`, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontFamily: f.d, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2 }}>Public Subscriber Counter</div>
        <div style={{ fontFamily: f.b, fontSize: 13, color: C.textSec }}>Showing <strong>47 CISOs subscribed</strong> on the Chicago city page. Auto-updating.</div>
      </div>
      <div style={{ fontFamily: f.d, fontSize: 32, fontWeight: 800, color: C.highlight, background: C.surface, padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.highlightBorder}` }}>47</div>
    </div>
    <div style={{ padding: "18px 20px", borderRadius: 10, background: C.surface, border: `1px solid ${C.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontFamily: f.d, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2 }}>Photo Gallery Visibility</div>
        <div style={{ fontFamily: f.b, fontSize: 13, color: C.textSec }}>Toggle "You Missed It" and "Photo Gallery" sections on the public site. Hide until you have photos.</div>
      </div>
      <Toggle />
    </div>
  </div>
);

const SubmissionsPage = () => {
  const [subs, setSubs] = useState(MOCK_SUBMISSIONS);
  const [sel, setSel] = useState(null);
  const [flt, setFlt] = useState("pending");
  const filtered = flt === "all" ? subs : subs.filter(s => s.status === flt);
  const counts = { pending: subs.filter(s => s.status === "pending").length, approved: subs.filter(s => s.status === "approved").length, rejected: subs.filter(s => s.status === "rejected").length };
  const update = (id, st) => { setSubs(p => p.map(s => s.id === id ? { ...s, status: st } : s)); setSel(null); };

  return (
    <div>
      <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>Submissions</h2>
      <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Review and approve organizer-submitted events.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ k: "pending", l: "Pending", c: counts.pending }, { k: "approved", l: "Approved", c: counts.approved }, { k: "rejected", l: "Rejected", c: counts.rejected }, { k: "all", l: "All" }].map(t => (
          <button key={t.k} onClick={() => { setFlt(t.k); setSel(null); }} style={{ fontFamily: f.b, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6, cursor: "pointer", background: flt === t.k ? C.surface : "transparent", color: flt === t.k ? C.text : C.textMuted, border: `1px solid ${flt === t.k ? C.border : C.borderSubtle}`, boxShadow: flt === t.k ? "0 1px 2px rgba(0,0,0,0.04)" : "none" }}>{t.l}{t.c !== undefined && ` (${t.c})`}</button>
        ))}
      </div>
      {!sel ? (
        <div>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontFamily: f.b }}>No {flt} submissions.</div>}
          {filtered.map(s => (
            <div key={s.id} onClick={() => setSel(s)} style={{ padding: "14px 16px", marginBottom: 8, borderRadius: 10, background: C.surface, border: `1px solid ${C.borderSubtle}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: f.b, fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted }}>{s.organizer} · {s.date} · {s.type}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: f.b, fontSize: 11, color: C.textMuted }}>{s.submitted}</span>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 24, borderRadius: 12, background: C.surface, border: `1px solid ${C.borderSubtle}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <button onClick={() => setSel(null)} style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted, background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0 }}>← Back to list</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ fontFamily: f.d, fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>{sel.title}</h3>
            <StatusBadge status={sel.status} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[["Organizer", sel.organizer], ["Date", sel.date], ["City", sel.city], ["Type", sel.type], ["Venue", sel.venue], ["Invite Only", sel.inviteOnly ? "Yes" : "No"], ["Submitted", sel.submitted]].map(([l, v], i) => (
              <div key={i}><div style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div><div style={{ fontFamily: f.b, fontSize: 14, color: C.text }}>{v}</div></div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}><div style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Registration Link</div><div style={{ fontFamily: f.b, fontSize: 14, color: C.blue, wordBreak: "break-all" }}>{sel.link}</div></div>
          <div style={{ marginBottom: 24 }}><div style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>Description</div><div style={{ fontFamily: f.b, fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{sel.description}</div></div>
          {sel.status === "pending" ? (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => update(sel.id, "approved")} style={{ flex: 1, fontFamily: f.d, fontSize: 13, fontWeight: 700, padding: "11px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: C.highlight, color: "#fff" }}>✓ Approve & Publish</button>
              <button onClick={() => update(sel.id, "rejected")} style={{ flex: 1, fontFamily: f.d, fontSize: 13, fontWeight: 700, padding: "11px 20px", borderRadius: 8, cursor: "pointer", background: "transparent", color: C.red, border: `1.5px solid ${C.redBorder}` }}>✗ Reject</button>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: sel.status === "approved" ? C.highlightSoft : C.redSoft, fontFamily: f.b, fontSize: 13, color: sel.status === "approved" ? C.highlight : C.red }}>This submission has been {sel.status}.{sel.status === "rejected" && " The organizer has been notified."}</div>
          )}
        </div>
      )}
    </div>
  );
};

const SubscribersPage = () => {
  const [cf, setCf] = useState("all");
  const filtered = cf === "all" ? MOCK_SUBSCRIBERS : MOCK_SUBSCRIBERS.filter(s => s.city === cf);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>Subscribers</h2>
        <div style={{ fontFamily: f.d, fontSize: 13, fontWeight: 700, color: C.highlight, background: C.highlightSoft, padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.highlightBorder}` }}>{MOCK_SUBSCRIBERS.length} total</div>
      </div>
      <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 20 }}>All subscribers. Waitlisted subscribers are in non-live cities.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "Chicago", "New York", "DC"].map(c => (
          <button key={c} onClick={() => setCf(c)} style={{ fontFamily: f.b, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6, cursor: "pointer", background: cf === c ? C.surface : "transparent", color: cf === c ? C.text : C.textMuted, border: `1px solid ${cf === c ? C.border : C.borderSubtle}` }}>{c === "all" ? "All Cities" : c}</button>
        ))}
      </div>
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.borderSubtle}`, background: C.surface }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr", padding: "10px 16px", background: C.surfaceAlt, borderBottom: `1px solid ${C.borderSubtle}`, gap: 8 }}>
          {["Email", "City", "Frequency", "Title", "Joined"].map(h => <div key={h} style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>)}
        </div>
        {filtered.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr", padding: "11px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderSubtle}` : "none", gap: 8, alignItems: "center" }}>
            <div style={{ fontFamily: f.b, fontSize: 13, color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</div>
            <div style={{ fontFamily: f.b, fontSize: 13, color: s.city === "Chicago" ? C.text : C.textMuted }}>{s.city}</div>
            <div style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted }}>{s.freq}</div>
            <div style={{ fontFamily: f.b, fontSize: 12, color: C.textSec }}>{s.title}</div>
            <div style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted }}>{s.joined}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button style={{ fontFamily: f.d, fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 6, border: `1.5px solid ${C.border}`, cursor: "pointer", background: C.surface, color: C.text }}>Export CSV</button>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>Events</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ fontFamily: f.d, fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>+ Add Event Manually</button>
      </div>
      <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 20 }}>All published and past events from Chicago_events.xlsx + approved submissions.</p>
      {showForm && (
        <div style={{ padding: 20, borderRadius: 10, background: C.surface, border: `1px solid ${C.borderSubtle}`, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontFamily: f.d, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>Add Event Manually</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {["Event Name", "Date", "City", "Type", "Organizer", "Venue", "Registration Link"].map(l => (
              <div key={l}><label style={{ display: "block", fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{l}</label><input placeholder={l} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, background: C.surfaceAlt, border: `1.5px solid ${C.borderSubtle}`, color: C.text, fontFamily: f.b, fontSize: 13, boxSizing: "border-box", outline: "none" }} /></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ fontFamily: f.d, fontSize: 12, fontWeight: 700, padding: "9px 20px", borderRadius: 6, border: "none", cursor: "pointer", background: C.highlight, color: "#fff" }}>Publish Event</button>
            <button onClick={() => setShowForm(false)} style={{ fontFamily: f.d, fontSize: 12, fontWeight: 600, padding: "9px 20px", borderRadius: 6, cursor: "pointer", background: "transparent", color: C.textMuted, border: `1px solid ${C.borderSubtle}` }}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.borderSubtle}`, background: C.surface }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 0.8fr 0.6fr", padding: "10px 16px", background: C.surfaceAlt, borderBottom: `1px solid ${C.borderSubtle}`, gap: 8 }}>
          {["Event", "Date", "Organizer", "Status", "Photos"].map(h => <div key={h} style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>)}
        </div>
        {MOCK_EVENTS.map((ev, i) => (
          <div key={ev.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 0.8fr 0.6fr", padding: "12px 16px", borderBottom: i < MOCK_EVENTS.length - 1 ? `1px solid ${C.borderSubtle}` : "none", gap: 8, alignItems: "center" }}>
            <div style={{ fontFamily: f.b, fontSize: 13, color: C.text, fontWeight: 500 }}>{ev.title}</div>
            <div style={{ fontFamily: f.b, fontSize: 12, color: C.textMuted }}>{ev.date}</div>
            <div style={{ fontFamily: f.b, fontSize: 12, color: C.textSec }}>{ev.organizer}</div>
            <StatusBadge status={ev.status} />
            <div style={{ fontFamily: f.b, fontSize: 12, color: ev.photos > 0 ? C.highlight : C.textMuted }}>{ev.photos > 0 ? `${ev.photos} 📸` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhotosPage = () => (
  <div>
    <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>Photos</h2>
    <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Upload event photos. Watermarked with eventlist.io automatically.</p>
    <div style={{ padding: "32px 24px", borderRadius: 10, textAlign: "center", border: `2px dashed ${C.border}`, background: C.surfaceAlt, marginBottom: 24, cursor: "pointer" }}>
      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📸</div>
      <div style={{ fontFamily: f.d, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Upload Photos</div>
      <div style={{ fontFamily: f.b, fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Drag and drop, or click to select. JPG, PNG up to 10MB each.</div>
      <select style={{ padding: "8px 14px", borderRadius: 6, border: `1.5px solid ${C.borderSubtle}`, fontFamily: f.b, fontSize: 13, color: C.text, background: C.surface, cursor: "pointer" }}>
        <option>Select event to attach photos to...</option>
        {MOCK_EVENTS.map(e => <option key={e.id}>{e.title} — {e.date}</option>)}
      </select>
    </div>
    <h3 style={{ fontFamily: f.d, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Past Events — Ready for Photos ({MOCK_EVENTS.filter(e => e.status === "past").length})</h3>
    {MOCK_EVENTS.filter(e => e.status === "past").map(ev => (
      <div key={ev.id} style={{ padding: "12px 16px", marginBottom: 6, borderRadius: 8, background: C.surface, border: `1px solid ${C.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontFamily: f.b, fontSize: 13, color: C.text, fontWeight: 500 }}>{ev.title}</div><div style={{ fontFamily: f.b, fontSize: 11, color: C.textMuted }}>{ev.date} · {ev.organizer}</div></div>
        <button style={{ fontFamily: f.d, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 5, border: "none", cursor: "pointer", background: C.text, color: "#fff" }}>+ Upload</button>
      </div>
    ))}
  </div>
);

const SettingsPage = () => (
  <div>
    <h2 style={{ fontFamily: f.d, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>Settings</h2>
    <p style={{ fontFamily: f.b, fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Platform configuration and email settings.</p>
    {[
      { title: "Email Delivery", desc: "Programmatic digest emails via API.", fields: [["Provider", "Resend (free up to 3K/month)"], ["Weekly Send", "Monday 8:00 AM CT"], ["Monthly Send", "1st of month, 8:00 AM CT"], ["From Address", "events@eventlist.io"]] },
      { title: "Live Cities", desc: "Cities with active event listings.", fields: [["Active", "Chicago"], ["Waitlist", "New York, DC, San Francisco, Boston, Dallas, Houston, Atlanta, Seattle"]] },
      { title: "Subscriber Counter", desc: "Public CISO count on city pages.", fields: [["Display Mode", "Real count (auto-updating)"], ["Current", "47 (Chicago)"]] },
    ].map((s, i) => (
      <div key={i} style={{ padding: 20, borderRadius: 10, background: C.surface, border: `1px solid ${C.borderSubtle}`, marginBottom: 16 }}>
        <h3 style={{ fontFamily: f.d, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.title}</h3>
        <p style={{ fontFamily: f.b, fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{s.desc}</p>
        {s.fields.map(([l, v], j) => (
          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderTop: j > 0 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div style={{ fontFamily: f.d, fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", minWidth: 120 }}>{l}</div>
            <div style={{ fontFamily: f.b, fontSize: 13, color: C.text, textAlign: "right" }}>{v}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ── Main ───────────────────────────────────────────────
export default function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const pages = [
    { k: "dashboard", l: "Dashboard" }, { k: "submissions", l: "Submissions", c: 3 },
    { k: "subscribers", l: "Subscribers", c: 10 }, { k: "events", l: "Events", c: 23 },
    { k: "photos", l: "Photos" }, { k: "settings", l: "Settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: f.b, display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(45,95,45,0.15); }
        input::placeholder { color: #B0B0B0; }
        input:focus { outline: none; border-color: #B0B0B0 !important; }
        button:hover { opacity: 0.88; }
        @media (max-width: 768px) { .adm-side { display: none !important; } .adm-main { margin-left: 0 !important; } }
      `}</style>

      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderSubtle}`, background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: f.d, fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>Event<span style={{ color: C.highlight }}>List</span></span>
          <span style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", background: C.surfaceAlt, padding: "3px 10px", borderRadius: 4, border: `1px solid ${C.borderSubtle}` }}>Admin</span>
        </div>
        <div style={{ fontFamily: f.b, fontSize: 13, color: C.textMuted }}>misha@aphinia.com</div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div className="adm-side" style={{ width: 220, padding: "16px 12px", borderRight: `1px solid ${C.borderSubtle}`, background: C.surfaceAlt, flexShrink: 0, position: "sticky", top: 46, height: "calc(100vh - 46px)", overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {pages.map(p => <NavItem key={p.k} label={p.l} count={p.c} active={page === p.k} onClick={() => setPage(p.k)} />)}
          </div>
          <div style={{ marginTop: 24, padding: 14, borderRadius: 8, background: C.highlightSoft, border: `1px solid ${C.highlightBorder}` }}>
            <div style={{ fontFamily: f.d, fontSize: 10, fontWeight: 700, color: C.highlight, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Live Counter</div>
            <div style={{ fontFamily: f.d, fontSize: 26, fontWeight: 800, color: C.highlight }}>47</div>
            <div style={{ fontFamily: f.b, fontSize: 11, color: C.textSec }}>CISOs subscribed</div>
          </div>
        </div>

        <div className="adm-main" style={{ flex: 1, padding: "28px 32px", maxWidth: 900 }}>
          {page === "dashboard" && <Dashboard />}
          {page === "submissions" && <SubmissionsPage />}
          {page === "subscribers" && <SubscribersPage />}
          {page === "events" && <EventsPage />}
          {page === "photos" && <PhotosPage />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
