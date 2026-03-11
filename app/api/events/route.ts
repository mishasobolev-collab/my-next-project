import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/events?city=chicago&type=Dinner&status=upcoming&limit=20
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const status = searchParams.get("status") || "upcoming";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  let sql = `
    SELECT e.id, e.title, e.slug, 
           TO_CHAR(e.date, 'Mon DD') as date_display,
           e.date, e.type, e.organizer, e.venue, e.description,
           e.external_url, e.invite_only, e.photo_count, e.status,
           c.name as city_name, c.slug as city_slug
    FROM events e
    JOIN cities c ON e.city_id = c.id
    WHERE 1=1
  `;

  const params: any[] = [];
  let idx = 1;

  if (city) {
    sql += ` AND c.slug = $${idx++}`;
    params.push(city);
  }

  if (type && type !== "All") {
    sql += ` AND e.type = $${idx++}`;
    params.push(type);
  }

  if (status === "upcoming") {
    sql += " AND e.date >= CURRENT_DATE AND e.status = 'published'";
  } else if (status === "past") {
    sql += " AND (e.date < CURRENT_DATE OR e.status = 'past')";
  }

  sql += " ORDER BY e.date ASC";
  sql += ` LIMIT $${idx++}`;
  params.push(limit);

  const events = await query(sql, params);

  return NextResponse.json({
    events,
    total: events.length,
    city: city || "all",
  });
}
