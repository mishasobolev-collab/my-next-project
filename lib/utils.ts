// ============================================
// UTILITY FUNCTIONS
// ============================================

// Generate URL-safe slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

// Format date for display (e.g., "May 6")
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Format date for full display (e.g., "May 6, 2026")
export function formatDateFull(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Check if a date is in the past
export function isPastDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

// ============================================
// SITE CONSTANTS
// ============================================
export const SITE_CONFIG = {
  name: "EventList",
  tagline: "Where CISOs Find Trusted Rooms",
  description:
    "Discover private dinners, executive roundtables, summits, and curated cybersecurity events in your city.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://eventlist.io",
};

export const COLORS = {
  bg: "#FAFAF9",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F3",
  text: "#1A1A1A",
  textSecondary: "#525252",
  textMuted: "#8C8C8C",
  highlight: "#2D5F2D",
  warm: "#B44D1E",
  blue: "#25508C",
  border: "#E5E5E3",
  borderSubtle: "#EDEDEB",
};

export const FONTS = {
  display: "'Montserrat', sans-serif",
  body: "'DM Sans', sans-serif",
};

export const EVENT_TYPES = ["Dinner", "Conference", "Half-day", "Full-day", "Multi-day"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
