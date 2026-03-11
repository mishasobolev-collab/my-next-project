import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/lib/db";
import { validateEventSubmission, sanitizeText } from "@/lib/validation";

// GET /api/admin/events?city=chicago&status=published
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const status = searchParams.get("status");

  let sql = `
    SELECT e.*, c.name as city_name, c.slug as city_slug
    FROM events e
    JOIN cities c ON e.city_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (city) {
    sql += ` AND c.slug = $${paramIndex++}`;
    params.push(city);
  }
  if (status) {
    sql += ` AND e.status = $${paramIndex++}`;
    params.push(status);
  }

  sql += " ORDER BY e.date ASC";

  const events = await query(sql, params);
  return NextResponse.json({ events, total: events.length });
}

// POST /api/admin/events — manually create an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateEventSubmission(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data!;

    const cityRow = await queryOne<{ id: string; slug: string }>(
      "SELECT id, slug FROM cities WHERE name = $1 OR slug = $1",
      [data.city]
    );

    if (!cityRow) {
      return NextResponse.json({ error: "City not found" }, { status: 400 });
    }

    const slug = sanitizeText(data.title, 200)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + data.date.slice(0, 7);

    const result = await query<{ id: string }>(
      `INSERT INTO events 
       (city_id, title, slug, date, type, organizer, venue, description, external_url, invite_only, status, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', 'manual')
       RETURNING id`,
      [
        cityRow.id,
        data.title,
        slug,
        data.date,
        data.type,
        data.organizer,
        data.venue,
        data.description,
        data.external_url,
        data.invite_only,
      ]
    );

    return NextResponse.json({
      success: true,
      event_id: result[0].id,
      url: `/${cityRow.slug}/${slug}`,
    });
  } catch (error: any) {
    console.error("Admin create event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
