import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";

// GET /api/admin/photos?event_id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("event_id");

  if (eventId) {
    const photos = await query(
      "SELECT * FROM photos WHERE event_id = $1 ORDER BY sort_order ASC",
      [eventId]
    );
    return NextResponse.json({ photos });
  }

  // Overview: events with photo counts
  const events = await query(`
    SELECT e.id, e.title, e.date, e.organizer, e.photo_count, e.status,
           c.name as city_name
    FROM events e
    JOIN cities c ON e.city_id = c.id
    ORDER BY e.photo_count DESC, e.date DESC
  `);

  return NextResponse.json({ events });
}

// POST /api/admin/photos
// After uploading to DO Spaces, register the photo in the database
// Body: { event_id, filename, original_url, watermarked_url, thumbnail_url, width, height, file_size }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_id,
      filename,
      original_url,
      watermarked_url,
      thumbnail_url,
      width,
      height,
      file_size,
    } = body;

    if (!event_id || !filename || !original_url) {
      return NextResponse.json(
        { error: "event_id, filename, and original_url are required" },
        { status: 400 }
      );
    }

    // Get current max sort_order for this event
    const maxOrder = await query<{ max: number }>(
      "SELECT COALESCE(MAX(sort_order), 0) as max FROM photos WHERE event_id = $1",
      [event_id]
    );

    const result = await query<{ id: string }>(
      `INSERT INTO photos 
       (event_id, filename, original_url, watermarked_url, thumbnail_url, width, height, file_size, sort_order, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'admin')
       RETURNING id`,
      [
        event_id,
        filename,
        original_url,
        watermarked_url || null,
        thumbnail_url || null,
        width || null,
        height || null,
        file_size || null,
        (maxOrder[0]?.max || 0) + 1,
      ]
    );

    return NextResponse.json({
      success: true,
      photo_id: result[0].id,
    });
  } catch (error: any) {
    console.error("Admin photos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/photos
// Body: { photo_id }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { photo_id } = body;

    if (!photo_id) {
      return NextResponse.json({ error: "photo_id required" }, { status: 400 });
    }

    // TODO: Also delete from DO Spaces
    await execute("DELETE FROM photos WHERE id = $1", [photo_id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete photo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
