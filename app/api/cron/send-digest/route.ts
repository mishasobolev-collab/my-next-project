import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";
import { sendDigestEmail } from "@/lib/email";

// ============================================
// GET /api/cron/send-digest?type=weekly&secret=xxx
// ============================================
// Called by external cron (cron-job.org or system crontab)
// - type=weekly: sends to weekly subscribers, events in next 7 days
// - type=monthly: sends to monthly subscribers, events in next 30 days
// - secret: must match CRON_SECRET env var to prevent unauthorized triggers

export async function GET(request: NextRequest) {
  // ── Auth: verify cron secret ──
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const type = searchParams.get("type") as "weekly" | "monthly";

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (type !== "weekly" && type !== "monthly") {
    return NextResponse.json(
      { error: "type must be 'weekly' or 'monthly'" },
      { status: 400 }
    );
  }

  try {
    // ── Get all live cities ──
    const liveCities = await query<{
      id: string;
      name: string;
      slug: string;
    }>("SELECT id, name, slug FROM cities WHERE is_live = TRUE");

    if (liveCities.length === 0) {
      return NextResponse.json({ message: "No live cities", sent: 0 });
    }

    let totalSent = 0;
    let totalFailed = 0;
    const results: any[] = [];

    for (const city of liveCities) {
      // ── Get upcoming events for this city within the digest window ──
      const daysAhead = type === "weekly" ? 7 : 30;

      const events = await query<{
        title: string;
        date: string;
        type: string;
        organizer: string;
        venue: string;
        slug: string;
        invite_only: boolean;
      }>(
        `SELECT title, 
                TO_CHAR(date, 'Mon DD') as date, 
                type, organizer, venue, slug, invite_only
         FROM events
         WHERE city_id = $1
           AND status = 'published'
           AND date >= CURRENT_DATE
           AND date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
         ORDER BY date ASC`,
        [city.id]
      );

      if (events.length === 0) {
        results.push({
          city: city.name,
          events: 0,
          subscribers: 0,
          sent: 0,
          skipped: "no upcoming events",
        });
        continue;
      }

      // ── Get subscribers for this city and frequency ──
      const subscribers = await query<{
        id: string;
        email: string;
        unsubscribe_token: string;
      }>(
        `SELECT id, email, unsubscribe_token
         FROM subscribers
         WHERE city_id = $1
           AND frequency = $2
           AND is_active = TRUE`,
        [city.id, type]
      );

      if (subscribers.length === 0) {
        results.push({
          city: city.name,
          events: events.length,
          subscribers: 0,
          sent: 0,
          skipped: "no subscribers for this frequency",
        });
        continue;
      }

      // ── Send to each subscriber ──
      let citySent = 0;
      let cityFailed = 0;

      for (const sub of subscribers) {
        const eventsWithCity = events.map((ev) => ({
          ...ev,
          city_slug: city.slug,
        }));

        const result = await sendDigestEmail(
          {
            id: sub.id,
            email: sub.email,
            unsubscribe_token: sub.unsubscribe_token,
            city_name: city.name,
            city_slug: city.slug,
          },
          eventsWithCity,
          type
        );

        // Log the send
        await execute(
          `INSERT INTO email_sends (subscriber_id, email_type, subject, resend_id, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            sub.id,
            type,
            `${type === "weekly" ? "This week" : "This month"} in ${city.name} cybersecurity`,
            result.resendId || null,
            result.success ? "sent" : "failed",
          ]
        );

        if (result.success) {
          citySent++;
          totalSent++;
        } else {
          cityFailed++;
          totalFailed++;
        }

        // Small delay between sends to respect Resend rate limits (10/sec on free tier)
        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      results.push({
        city: city.name,
        events: events.length,
        subscribers: subscribers.length,
        sent: citySent,
        failed: cityFailed,
      });
    }

    return NextResponse.json({
      type,
      timestamp: new Date().toISOString(),
      totalSent,
      totalFailed,
      cities: results,
    });
  } catch (error: any) {
    console.error("Cron send-digest error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
