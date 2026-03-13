"use client";

export default function AdminSettings() {
  const sections = [
    {
      title: "Email Delivery",
      desc: "Programmatic digest emails via API.",
      fields: [
        ["Provider", "Resend (free up to 3K/month)"],
        ["Weekly Send", "Monday 8:00 AM CT"],
        ["Monthly Send", "1st of month, 8:00 AM CT"],
        ["From Address", "events@eventlist.io"],
      ],
    },
    {
      title: "Live Cities",
      desc: "Cities with active event listings.",
      fields: [
        ["Active", "Chicago"],
        ["Waitlist", "New York, DC, San Francisco, Boston, Dallas, Houston, Atlanta, Seattle"],
      ],
    },
    {
      title: "Subscriber Counter",
      desc: "Public CISO count on city pages.",
      fields: [
        ["Display Mode", "Real count (auto-updating)"],
        ["Current", "Loaded from database"],
      ],
    },
  ];

  return (
    <div>
      <h2 className="font-display text-[22px] font-extrabold tracking-tight mb-1.5">Settings</h2>
      <p className="font-body text-sm text-brand-textMuted mb-6">Platform configuration and email settings.</p>

      {sections.map((section, i) => (
        <div key={i} className="p-5 rounded-[10px] bg-white border border-brand-borderSubtle mb-4">
          <h3 className="font-display text-[15px] font-bold text-brand-text mb-1">{section.title}</h3>
          <p className="font-body text-[13px] text-brand-textMuted mb-4">{section.desc}</p>
          {section.fields.map(([label, value], j) => (
            <div
              key={j}
              className={`flex justify-between items-baseline py-2 ${
                j > 0 ? "border-t border-brand-borderSubtle" : ""
              }`}
            >
              <div className="font-display text-[11px] font-bold text-brand-textMuted tracking-[0.04em] uppercase min-w-[120px]">
                {label}
              </div>
              <div className="font-body text-[13px] text-brand-text text-right">{value}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
