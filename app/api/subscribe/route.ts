import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, execute } from "@/lib/db";
import { validateSubscriber, checkRateLimit } from "@/lib/validation";
import { sendWelcomeEmail } from "@/lib/email";

// POST /api/subscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateSubscriber(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const { email, city, frequency } = validation.data!;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Rate limit by IP
    const allowed = await checkRateLimit(`subscribe:${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check if already subscribed
    const existing = await queryOne<{ id: string; is_active: boolean }>(
      "SELECT id, is_active FROM subscribers WHERE email = $1",
      [email]
    );

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        );
      }

      // Reactivate if previously unsubscribed
      await execute(
        "UPDATE subscribers SET is_active = TRUE, frequency = $1, updated_at = NOW() WHERE email = $2",
        [frequency, email]
      );

      return NextResponse.json({
        success: true,
        message: "Resubscribed successfully.",
      });
    }

    // Look up city
    const cityRow = await queryOne<{ id: string; name: string; slug: string }>(
      "SELECT id, name, slug FROM cities WHERE name = $1 OR slug = $1",
      [city]
    );

    if (!cityRow) {
      return NextResponse.json({ error: "City not found." }, { status: 400 });
    }

    // Insert subscriber
    const result = await query<{ unsubscribe_token: string }>(
      `INSERT INTO subscribers (email, city_id, frequency, source)
       VALUES ($1, $2, $3, 'website')
       RETURNING unsubscribe_token`,
      [email, cityRow.id, frequency]
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail(
      email,
      cityRow.name,
      cityRow.slug,
      result[0].unsubscribe_token
    ).catch(console.error);

    return NextResponse.json({
      success: true,
      message: `Subscribed to ${cityRow.name} events (${frequency}).`,
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}