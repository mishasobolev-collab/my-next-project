import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { validateEventSubmission, checkRateLimit } from "@/lib/validation";
import { sendSubmissionConfirmation } from "@/lib/email";

// POST /api/submit-event
export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per IP per hour
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`submit:${ip}`, 3, 3600000)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

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

    // Look up city
    const cityRow = await queryOne<{ id: string }>(
      "SELECT id FROM cities WHERE name = $1 OR slug = $1",
      [data.city]
    );

    if (!cityRow) {
      return NextResponse.json(
        { error: "City not found. Currently accepting events for Chicago only." },
        { status: 400 }
      );
    }

    // Insert submission as pending
    await execute(
      `INSERT INTO submissions 
       (city_id, title, date, type, organizer, venue, description, external_url, invite_only, submitter_email, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')`,
      [
        cityRow.id,
        data.title,
        data.date,
        data.type,
        data.organizer,
        data.venue,
        data.description,
        data.external_url,
        data.invite_only,
        data.submitter_email || null,
      ]
    );

    // Send confirmation email if submitter provided email
    if (data.submitter_email) {
      sendSubmissionConfirmation(data.submitter_email, data.title).catch(
        console.error
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event submitted for review. We'll review it within 24 hours.",
    });
  } catch (error: any) {
    console.error("Submit event error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
