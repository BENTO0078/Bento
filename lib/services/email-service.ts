import { getResend, EMAIL_FROM } from "@/lib/email/client";
import {
  welcomeTemplate,
  onboardingCompleteTemplate,
  weeklySummaryTemplate,
  savingsAlertTemplate,
  renewalReminderTemplate,
  churnPreventionTemplate,
} from "@/lib/email/templates";
import type { SavingsEvent } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bento.app";

/**
 * Shared helper: sends an email via Resend with graceful error handling.
 * Never throws — failures are caught, logged, and swallowed so email
 * issues never block the calling flow.
 */
async function sendEmailSafe(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string }> {
  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (result.error) {
      console.error("Resend API error:", result.error);
      return { success: false };
    }

    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false };
  }
}

/** Sent immediately after signup. Does NOT block signup flow. */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const { subject, html } = welcomeTemplate({ name, appUrl: APP_URL });
  await sendEmailSafe({ to: email, subject, html });
}

/**
 * Sent after the onboarding scan completes successfully.
 * `savingsFound` is in cents.
 */
export async function sendOnboardingCompleteEmail(
  email: string,
  name: string,
  savingsFound: number
): Promise<void> {
  const { subject, html } = onboardingCompleteTemplate({
    name,
    savingsFound,
    appUrl: APP_URL,
  });
  await sendEmailSafe({ to: email, subject, html });
}

/**
 * Weekly digest with savings highlights, score, and event breakdown.
 * `weeklySavings` and event `amount_cents` are in cents.
 */
export async function sendWeeklySummary(
  email: string,
  name: string,
  weeklySavings: number,
  score: number,
  events: SavingsEvent[]
): Promise<void> {
  const { subject, html } = weeklySummaryTemplate({
    name,
    weeklySavings,
    score,
    events,
    appUrl: APP_URL,
  });
  await sendEmailSafe({ to: email, subject, html });
}

/**
 * Real-time alert when Bento finds a new savings opportunity.
 * `amount` is in cents.
 */
export async function sendSavingsAlert(
  email: string,
  name: string,
  alertTitle: string,
  amount: number,
  action: string
): Promise<void> {
  const { subject, html } = savingsAlertTemplate({
    name,
    alertTitle,
    amount,
    action,
    appUrl: APP_URL,
  });
  await sendEmailSafe({ to: email, subject, html });
}

/**
 * Reminder that a subscription is about to renew.
 * `amount` is in cents, `date` is a human-readable date string.
 */
export async function sendRenewalReminder(
  email: string,
  name: string,
  subscriptionName: string,
  amount: number,
  date: string
): Promise<void> {
  const { subject, html } = renewalReminderTemplate({
    name,
    subscriptionName,
    amount,
    date,
    appUrl: APP_URL,
  });
  await sendEmailSafe({ to: email, subject, html });
}

/**
 * Re-engagement email for inactive users.
 * `daysSinceLastVisit` should be the number of days since last dashboard visit.
 */
export async function sendChurnPrevention(
  email: string,
  name: string,
  daysSinceLastVisit: number
): Promise<void> {
  const { subject, html } = churnPreventionTemplate({
    name,
    daysSinceLastVisit,
    appUrl: APP_URL,
  });
  await sendEmailSafe({ to: email, subject, html });
}
