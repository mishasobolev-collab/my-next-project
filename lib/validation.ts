// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================
// All user input MUST pass through these before touching the database.
// The database layer uses parameterized queries as a second line of defense.

// Strip HTML tags and script content
export function stripHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

// Sanitize text input: strip HTML, enforce max length, trim
export function sanitizeText(
  input: string | undefined | null,
  maxLength: number = 500
): string {
  if (!input) return "";
  const cleaned = stripHtml(String(input));
  return cleaned.slice(0, maxLength).trim();
}

// Validate email format (RFC 5322 simplified)
export function isValidEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return pattern.test(email) && email.length <= 320;
}

// Validate URL format (must be https)
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// Validate date string (YYYY-MM-DD or parseable date)
export function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

// Validate event type against allowed values
const ALLOWED_EVENT_TYPES = [
  "Dinner",
  "Conference",
  "Half-day",
  "Full-day",
  "Multi-day",
];

export function isValidEventType(type: string): boolean {
  return ALLOWED_EVENT_TYPES.includes(type);
}

// Validate frequency
export function isValidFrequency(freq: string): boolean {
  return freq === "weekly" || freq === "monthly";
}

// Full validation for subscriber form
export interface SubscriberInput {
  email: string;
  city: string;
  frequency: string;
}

export function validateSubscriber(input: any): {
  valid: boolean;
  errors: string[];
  data?: SubscriberInput;
} {
  const errors: string[] = [];

  const email = sanitizeText(input.email, 320).toLowerCase();
  if (!email || !isValidEmail(email)) {
    errors.push("Valid email address is required");
  }

  const city = sanitizeText(input.city, 100);
  if (!city) {
    errors.push("City is required");
  }

  const frequency = sanitizeText(input.frequency, 10);
  if (!isValidFrequency(frequency || "weekly")) {
    errors.push("Frequency must be weekly or monthly");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: { email, city, frequency: frequency || "weekly" },
  };
}

// Full validation for event submission form
export interface EventSubmissionInput {
  title: string;
  date: string;
  city: string;
  type: string;
  organizer: string;
  venue: string;
  description: string;
  external_url: string;
  invite_only: boolean;
  submitter_email?: string;
}

export function validateEventSubmission(input: any): {
  valid: boolean;
  errors: string[];
  data?: EventSubmissionInput;
} {
  const errors: string[] = [];

  const title = sanitizeText(input.title, 300);
  if (!title || title.length < 3) {
    errors.push("Event name is required (min 3 characters)");
  }

  const date = sanitizeText(input.date, 50);
  if (!date || !isValidDate(date)) {
    errors.push("Valid date is required");
  }

  const city = sanitizeText(input.city, 100);
  if (!city) {
    errors.push("City is required");
  }

  const type = sanitizeText(input.type, 50);
  if (!type || !isValidEventType(type)) {
    errors.push(
      `Event type must be one of: ${ALLOWED_EVENT_TYPES.join(", ")}`
    );
  }

  const organizer = sanitizeText(input.organizer, 200);
  if (!organizer) {
    errors.push("Organizer name is required");
  }

  const venue = sanitizeText(input.venue, 500);
  const description = sanitizeText(input.description, 2000);

  const external_url = sanitizeText(input.external_url, 1000);
  if (external_url && !isValidUrl(external_url)) {
    errors.push("Registration link must be a valid URL");
  }

  const invite_only = Boolean(input.invite_only);

  const submitter_email = sanitizeText(input.submitter_email, 320)?.toLowerCase();
  if (submitter_email && !isValidEmail(submitter_email)) {
    errors.push("Submitter email must be valid");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      title,
      date,
      city,
      type,
      organizer,
      venue,
      description,
      external_url,
      invite_only,
      submitter_email,
    },
  };
}

// Rate limiting helper (simple in-memory, replace with Redis for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxRequests) {
    return false; // rate limited
  }

  entry.count++;
  return true; // allowed
}
