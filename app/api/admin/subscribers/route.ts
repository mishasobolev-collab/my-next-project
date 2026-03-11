import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/subscribers?city=chicago&format=json|csv
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const format = searchParams.get("format") || "json";

  let sql = `
    SELECT s.id, s.email, c.name as city, s.frequency, s.title, 
           s.company, s.is_active, s.created_at as joined
    FROM subscribers s
    LEFT JOIN cities c ON s.city_id = c.id
  `;
  const params: any[] = [];

  if (city && city !== "all") {
    sql += " WHERE c.slug = $1";
    params.push(city);
  }

  sql += " ORDER BY s.created_at DESC";

  const subscribers = await query(sql, params);

  // CSV export
  if (format === "csv") {
    const headers = ["email", "city", "frequency", "title", "company", "active", "joined"];
    const rows = subscribers.map((s: any) =>
      [s.email, s.city, s.frequency, s.title || "", s.company || "", s.is_active, s.joined].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="eventlist-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // Counts
  const totalActive = subscribers.filter((s: any) => s.is_active).length;

  return NextResponse.json({
    subscribers,
    total: subscribers.length,
    active: totalActive,
  });
}
