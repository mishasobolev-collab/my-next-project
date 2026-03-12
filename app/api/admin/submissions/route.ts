import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/lib/db";
import { sanitizeText } from "@/lib/validation";
import { sendSubmissionApproved } from "@/lib/email";

// TODO: Add auth middleware check — all admin routes must verify session
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// GET /api/admin/submissions?status=pending
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  const submissions = await query(
    `SELECT s.*, c.name as city_name
     FROM submissions s
     JOIN cities c ON s.city_id = c.id
     ${status !== "all" ? "WHERE s.status = $1" : ""}
     ORDER BY s.created_at DESC`,
    status !== "all" ? [status] : []
  );

  return NextResponse.json({ submissions });
}

// PATCH /api/admin/submissions
// Body: { id, action: "approve" | "reject", rejection_reason? }
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, rejection_reason } = body;

    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "id and action (approve/reject) required" },
        { status: 400 }
      );
    }

    const submission = await queryOne<any>(
      `SELECT s.*, c.slug as city_slug, c.name as city_name
       FROM submissions s
       JOIN cities c ON s.city_id = c.id
       WHERE s.id = $1`,
      [id]
    );

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json(
        { error: `Submission already ${submission.status}` },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Generate slug from title
      const slug = sanitizeText(submission.title, 200)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + new Date(submission.date).toISOString().slice(0, 7); // append YYYY-MM

      // Create the event
      const eventRows = await query<{ id: string }>(
        `INSERT INTO events 
         (city_id, title, slug, date, type, organizer, venue, description, external_url, invite_only, status, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', 'submission')
         RETURNING id`,
        [
          submission.city_id,
          submission.title,
          slug,
          submission.date,
          submission.type,
          submission.organizer,
          submission.venue,
          submission.description,
          submission.external_url,
          submission.invite_only,
        ]
      );

      // Update submission status and link to event
      await execute(
        `UPDATE submissions 
         SET status = 'approved', reviewed_at = NOW(), reviewed_by = 'admin', event_id = $1
         WHERE id = $2`,
        [eventRows[0].id, id]
      );

      // Notify organizer
      if (submission.submitter_email) {
        const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${submission.city_slug}/${slug}`;
        sendSubmissionApproved(
          submission.submitter_email,
          submission.title,
          eventUrl
        ).catch(console.error);
      }

      return NextResponse.json({
        success: true,
        message: "Event approved and published",
        event_id: eventRows[0].id,
      });
    }

    if (action === "reject") {
      await execute(
        `UPDATE submissions 
         SET status = 'rejected', reviewed_at = NOW(), reviewed_by = 'admin', rejection_reason = $1
         WHERE id = $2`,
        [sanitizeText(rejection_reason, 500) || null, id]
      );

      return NextResponse.json({
        success: true,
        message: "Submission rejected",
      });
    }
  } catch (error: any) {
    console.error("Admin submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
