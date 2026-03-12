import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.EMAIL_FROM || "EventList <events@eventlist.io>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eventlist.io";

// ============================================
// TYPES
// ============================================
interface EventForEmail {
  title: string;
  date: string;
  type: string;
  organizer: string;
  venue: string;
  slug: string;
  invite_only: boolean;
  city_slug: string;
}

interface SubscriberForEmail {
  id: string;
  email: string;
  unsubscribe_token: string;
  city_name: string;
  city_slug: string;
}

// ============================================
// EMAIL TEMPLATES (inline HTML)
// ============================================
// Using inline HTML for maximum email client compatibility.
// React Email components can replace these later for maintainability.

function buildDigestHtml(
  subscriber: SubscriberForEmail,
  events: EventForEmail[],
  periodLabel: string
): string {
  const unsubscribeUrl = `${SITE_URL}/subscribe/unsubscribe?token=${subscriber.unsubscribe_token}`;

  const eventRows = events
    .map(
      (ev) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #EDEDEB;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="60" style="vertical-align: top; padding-top: 2px;">
              <span style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #2D5F2D; font-weight: 600;">
                ${ev.date}
              </span>
            </td>
            <td style="padding-left: 12px;">
              <a href="${SITE_URL}/${ev.city_slug}/${ev.slug}" style="font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1A1A1A; font-weight: 500; text-decoration: none;">
                ${ev.title}
              </a>
              <br/>
              <span style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #8C8C8C;">
                ${ev.type}${ev.invite_only ? " · Invite Only" : ""} · ${ev.organizer}
              </span>
              ${ev.venue && ev.venue !== "Not disclosed" ? `<br/><span style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #8C8C8C;">📍 ${ev.venue}</span>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF9; font-family: 'DM Sans', -apple-system, sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAFAF9;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="560" style="max-width: 560px;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 24px;">
              <span style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.03em;">
                Event<span style="color: #2D5F2D;">List</span>
              </span>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td style="padding-bottom: 8px;">
              <h1 style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800; color: #1A1A1A; letter-spacing: -0.02em;">
                ${periodLabel} in ${subscriber.city_name}
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #525252;">
                ${events.length} upcoming cybersecurity event${events.length !== 1 ? "s" : ""} for senior executives.
              </p>
            </td>
          </tr>
          
          <!-- Events -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" width="100%" style="background: #FFFFFF; border-radius: 10px; border: 1px solid #EDEDEB;">
                <tr>
                  <td style="padding: 4px 20px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      ${eventRows}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 28px 0;">
              <a href="${SITE_URL}/${subscriber.city_slug}" style="display: inline-block; padding: 12px 28px; background: #1A1A1A; color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px;">
                View All ${subscriber.city_name} Events →
              </a>
            </td>
          </tr>
          
          <!-- Forward CTA -->
          <tr>
            <td align="center" style="padding: 16px 0; border-top: 1px solid #EDEDEB;">
              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #8C8C8C;">
                Know a CISO who'd find this useful? 
                <a href="mailto:?subject=Cybersecurity events in ${subscriber.city_name}&body=Check out EventList for curated cybersecurity events: ${SITE_URL}/${subscriber.city_slug}" style="color: #2D5F2D; text-decoration: underline;">
                  Forward this email
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0 0;">
              <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #8C8C8C; text-align: center;">
                You're receiving this because you subscribed to ${subscriber.city_name} events on EventList.
                <br/>
                <a href="${unsubscribeUrl}" style="color: #8C8C8C; text-decoration: underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color: #8C8C8C; text-decoration: underline;">eventlist.io</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================
// SEND FUNCTIONS
// ============================================

export async function sendDigestEmail(
  subscriber: SubscriberForEmail,
  events: EventForEmail[],
  type: "weekly" | "monthly"
): Promise<{ success: boolean; resendId?: string; error?: string }> {
  if (events.length === 0) {
    return { success: false, error: "No events to send" };
  }

  const periodLabel =
    type === "weekly" ? "This Week" : "This Month";
  const subject =
    type === "weekly"
      ? `This week in ${subscriber.city_name} cybersecurity`
      : `${subscriber.city_name} cybersecurity events this month`;

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: subscriber.email,
      subject,
      html: buildDigestHtml(subscriber, events, periodLabel),
    });

    return { success: true, resendId: result.data?.id };
  } catch (error: any) {
    console.error(`Failed to send to ${subscriber.email}:`, error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(
  email: string,
  cityName: string,
  citySlug: string,
  unsubscribeToken: string
): Promise<{ success: boolean }> {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Welcome to EventList — ${cityName} events`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF9; font-family: 'DM Sans', sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAFAF9;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="560" style="max-width: 560px;">
          <tr>
            <td>
              <span style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 800; color: #1A1A1A;">Event<span style="color: #2D5F2D;">List</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0 16px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #1A1A1A;">You're in.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
                You'll receive curated cybersecurity events in ${cityName} — private dinners, executive roundtables, summits, and more. No spam, no vendor pitches.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <a href="${SITE_URL}/${citySlug}" style="display: inline-block; padding: 12px 28px; background: #1A1A1A; color: #fff; font-weight: 700; text-decoration: none; border-radius: 8px;">
                Browse ${cityName} Events
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 16px; border-top: 1px solid #EDEDEB;">
              <p style="margin: 0; font-size: 11px; color: #8C8C8C; text-align: center;">
                <a href="${SITE_URL}/subscribe/unsubscribe?token=${unsubscribeToken}" style="color: #8C8C8C;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function sendSubmissionConfirmation(
  email: string,
  eventTitle: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Event submitted: ${eventTitle}`,
      html: `
<body style="margin:0;padding:0;background:#FAFAF9;font-family:'DM Sans',sans-serif;">
<table width="100%" style="background:#FAFAF9;"><tr><td align="center" style="padding:40px 20px;">
<table width="560" style="max-width:560px;">
  <tr><td><span style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#1A1A1A;">Event<span style="color:#2D5F2D;">List</span></span></td></tr>
  <tr><td style="padding:24px 0 16px;"><h1 style="margin:0;font-size:20px;font-weight:800;color:#1A1A1A;">Submission received</h1></td></tr>
  <tr><td><p style="margin:0;font-size:14px;color:#525252;line-height:1.6;">Thanks for submitting <strong>${eventTitle}</strong>. We review every submission within 24 hours and will notify you once it's approved.</p></td></tr>
</table>
</td></tr></table></body>`,
    });
  } catch (error) {
    console.error("Failed to send submission confirmation:", error);
  }
}

export async function sendSubmissionApproved(
  email: string,
  eventTitle: string,
  eventUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your event is live: ${eventTitle}`,
      html: `
<body style="margin:0;padding:0;background:#FAFAF9;font-family:'DM Sans',sans-serif;">
<table width="100%" style="background:#FAFAF9;"><tr><td align="center" style="padding:40px 20px;">
<table width="560" style="max-width:560px;">
  <tr><td><span style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#1A1A1A;">Event<span style="color:#2D5F2D;">List</span></span></td></tr>
  <tr><td style="padding:24px 0 16px;"><h1 style="margin:0;font-size:20px;font-weight:800;color:#1A1A1A;">Your event is live!</h1></td></tr>
  <tr><td style="padding-bottom:24px;"><p style="margin:0;font-size:14px;color:#525252;line-height:1.6;"><strong>${eventTitle}</strong> is now listed on EventList and visible to CISOs in your city.</p></td></tr>
  <tr><td align="center"><a href="${eventUrl}" style="display:inline-block;padding:12px 28px;background:#1A1A1A;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;">View Your Listing</a></td></tr>
</table>
</td></tr></table></body>`,
    });
  } catch (error) {
    console.error("Failed to send approval notification:", error);
  }
}
