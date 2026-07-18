import type { SavingsEvent } from "@/types";

// ---------- shared layout ----------

function baseLayout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bento</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          ${body}
          <!-- Footer -->
          <tr>
            <td style="padding:24px 24px 32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:12px;">
                    <span style="font-size:24px;font-weight:800;color:#10b981;letter-spacing:-0.5px;">🍱 Bento</span>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#94a3b8;line-height:1.6;">
                    Bento — AI Life Admin<br>
                    <a href="{{unsubscribe_url}}" style="color:#94a3b8;">Unsubscribe</a> &middot;
                    <a href="{{app_url}}/dashboard/settings" style="color:#94a3b8;">Email preferences</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function header(title: string, subtitle?: string): string {
  return `<tr>
    <td style="background-color:#ffffff;padding:32px 24px 24px;border-radius:8px 8px 0 0;border:1px solid #e2e8f0;border-bottom:none;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding-bottom:16px;">
            <span style="font-size:28px;font-weight:800;color:#10b981;letter-spacing:-0.5px;">🍱 Bento</span>
          </td>
        </tr>
        <tr>
          <td style="font-size:22px;font-weight:700;color:#0f172a;text-align:center;line-height:1.3;">${title}</td>
        </tr>
        ${subtitle ? `<tr><td style="font-size:15px;color:#64748b;text-align:center;padding-top:8px;line-height:1.5;">${subtitle}</td></tr>` : ""}
      </table>
    </td>
  </tr>`;
}

function bodySection(content: string): string {
  return `<tr>
    <td style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${content}
      </table>
    </td>
  </tr>`;
}

/**
 * Rounded green button. `fullWidth` makes it fill the container.
 */
function ctaButton(text: string, url: string, fullWidth = false): string {
  return `<tr>
    <td align="center" style="padding:8px 0 16px;">
      <a href="${url}" style="display:${fullWidth ? "block" : "inline-block"};background-color:#10b981;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;text-align:center;${fullWidth ? "width:100%;box-sizing:border-box;" : ""}">${text}</a>
    </td>
  </tr>`;
}

function statRow(stats: { label: string; value: string }[]): string {
  const cells = stats
    .map(
      (s) => `<td style="text-align:center;padding:12px 8px;width:${Math.floor(100 / stats.length)}%;">
      <div style="font-size:22px;font-weight:700;color:#10b981;">${s.value}</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px;">${s.label}</div>
    </td>`
    )
    .join("");
  return `<tr>
    <td style="padding:16px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>${cells}</tr>
      </table>
    </td>
  </tr>`;
}

function divider(): string {
  return `<tr><td style="padding:0;border-top:1px solid #e2e8f0;"></td></tr>`;
}

function bodyText(text: string): string {
  return `<tr><td style="font-size:15px;color:#334155;line-height:1.6;padding-bottom:12px;">${text}</td></tr>`;
}

// ---------- Template functions ----------

export interface WelcomeTemplateParams {
  name: string;
  appUrl: string;
}

export function welcomeTemplate({ name, appUrl }: WelcomeTemplateParams): { subject: string; html: string } {
  const subject = `Welcome to Bento, ${name}! Let's find your hidden money.`;
  const html = baseLayout(
    header("You're in! 🎉", "Time to uncover the money you're leaving on the table.") +
      bodySection(
        bodyText(
          `Hi ${name}, welcome to Bento — your AI life-admin assistant. We scan your subscriptions, negotiate your bills, hunt down refunds, and track warranties so you don't have to lift a finger.`
        ) +
          bodyText("The average Bento user saves <strong>$500–$2,000 per year</strong> — and the best part? It happens automatically while you sleep.") +
          statRow([
            { label: "Avg. savings", value: "$500+" },
            { label: "Time saved", value: "10+ hrs" },
            { label: "Setup time", value: "2 min" },
          ]) +
          ctaButton("Start Your Free Scan →", `${appUrl}/onboarding`, true) +
          bodyText("The scan takes under 2 minutes. It checks your bank accounts for hidden subscriptions, finds bills you're overpaying, and flags refunds you're owed. Every dollar found adds to your <strong>Savings Score</strong> — the number you'll want to beat every month.")
      ) +
      bodySection(
        `<tr><td style="font-size:13px;color:#94a3b8;text-align:center;padding-top:8px;">
          Questions? Reply to this email — we read every one.
        </td></tr>`
      )
  );
  return { subject, html };
}

export interface OnboardingCompleteParams {
  name: string;
  savingsFound: number;
  appUrl: string;
}

export function onboardingCompleteTemplate({ name, savingsFound, appUrl }: OnboardingCompleteParams): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(savingsFound / 100);
  const subject = savingsFound > 0
    ? `You're leaving ${formatted}/year on the table, ${name}`
    : `Scan complete, ${name} — let's keep digging`;

  const html = baseLayout(
    header(
      savingsFound > 0 ? `💰 ${formatted}/year found!` : "Scan complete!",
      savingsFound > 0
        ? "We spotted savings opportunities in your accounts."
        : "We didn't find obvious leaks yet, but we're just getting started."
    ) +
      bodySection(
        savingsFound > 0
          ? bodyText(
              `Great news, ${name}. Our scan found <strong>${formatted}/year</strong> in potential savings across your financial accounts. These are real opportunities — unused subscriptions to cancel, bills that can be negotiated lower, and refunds you're eligible for.`
            ) +
              statRow([
                { label: "Potential savings", value: formatted },
                { label: "Your Score", value: `${Math.min(Math.floor(savingsFound / 100), 999)}` },
              ]) +
              ctaButton("View Your Savings Dashboard →", `${appUrl}/dashboard`, true) +
              bodyText("Bento works continuously in the background — it'll keep finding new opportunities and alert you instantly. The more you engage, the higher your Savings Score climbs.")
          : bodyText(
              `Hi ${name}, our initial scan didn't find obvious money leaks — and that's actually good news! But don't worry, Bento is just getting started. We'll keep monitoring your accounts 24/7 for new opportunities.`
            ) +
              ctaButton("Explore Your Dashboard →", `${appUrl}/dashboard`, true)
      )
  );
  return { subject, html };
}

export interface WeeklySummaryParams {
  name: string;
  weeklySavings: number;
  score: number;
  events: SavingsEvent[];
  appUrl: string;
}

export function weeklySummaryTemplate({ name, weeklySavings, score, events, appUrl }: WeeklySummaryParams): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(weeklySavings / 100);
  const subject = weeklySavings > 0
    ? `Bento saved you ${formatted} this week — Score: ${score}`
    : `Your weekly Bento update — Score: ${score}`;

  const eventRows = events.length > 0
    ? events
        .slice(0, 5)
        .map(
          (e) => `<tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;font-weight:600;color:#0f172a;">${e.title}</td>
                  <td style="font-size:14px;font-weight:600;color:#10b981;text-align:right;white-space:nowrap;padding-left:16px;">
                    ${e.amount_cents > 0 ? `+${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(e.amount_cents / 100)}` : "—"}
                  </td>
                </tr>
                ${e.description ? `<tr><td colspan="2" style="font-size:13px;color:#64748b;padding-top:2px;">${e.description}</td></tr>` : ""}
              </table>
            </td>
          </tr>`
        )
        .join("")
    : `<tr><td style="font-size:14px;color:#94a3b8;text-align:center;padding:16px 0;">No new savings events this week. Keep using Bento and check back soon!</td></tr>`;

  const html = baseLayout(
    header("Your weekly Bento update", `Here's what happened this week, ${name}.`) +
      bodySection(
        statRow([
          { label: "Savings Score", value: `${score}` },
          { label: "This week", value: formatted },
          { label: "Events", value: `${events.length}` },
        ]) +
          divider() +
          `<tr><td style="padding-top:16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${eventRows}
            </table>
          </td></tr>` +
          ctaButton("View Full Dashboard →", `${appUrl}/dashboard`, true)
      ) +
      bodySection(
        `<tr><td style="font-size:13px;color:#94a3b8;text-align:center;padding-top:8px;">
          ${events.length > 5 ? `<em>+${events.length - 5} more events — see them all on your dashboard.</em><br>` : ""}
          You're doing great. Every dollar counts toward that score!
        </td></tr>`
      )
  );
  return { subject, html };
}

export interface SavingsAlertParams {
  name: string;
  alertTitle: string;
  amount: number;
  action: string;
  appUrl: string;
}

export function savingsAlertTemplate({ name, alertTitle, amount, action, appUrl }: SavingsAlertParams): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  const subject = `🚨 Bento found ${formatted} in savings`;

  const html = baseLayout(
    header(`🚨 Savings alert!`, `${formatted} waiting for you.`) +
      bodySection(
        bodyText(`Hi ${name},`) +
          bodyText(`<strong>${alertTitle}</strong> — that's <strong style="color:#10b981;font-size:18px;">${formatted}</strong> you could be saving.`) +
          `<tr><td style="padding:12px 16px;background-color:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:14px;color:#065f46;line-height:1.5;">${action}</td>
              </tr>
            </table>
          </td></tr>` +
          ctaButton("Claim Your Savings →", `${appUrl}/dashboard`, true) +
          bodyText("These opportunities don't last forever — prices change, refund windows close, and warranties expire. Act now while it's available!")
      )
  );
  return { subject, html };
}

export interface RenewalReminderParams {
  name: string;
  subscriptionName: string;
  amount: number;
  date: string;
  appUrl: string;
}

export function renewalReminderTemplate({ name, subscriptionName, amount, date, appUrl }: RenewalReminderParams): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  const subject = `⏰ ${subscriptionName} renews in 3 days — ${formatted}`;

  const html = baseLayout(
    header("Upcoming renewal", `Don't get charged without knowing.`) +
      bodySection(
        bodyText(`Hi ${name},`) +
          bodyText(`Your <strong>${subscriptionName}</strong> subscription is set to renew on <strong>${date}</strong> for <strong>${formatted}</strong>.`) +
          `<tr><td style="padding:16px;background-color:#fffbeb;border-radius:8px;border:1px solid #fde68a;margin-bottom:12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:14px;color:#92400e;line-height:1.5;">
                  <strong>Still using it?</strong> If not, cancel now and save ${formatted}. We can handle it for you — just tap below.
                </td>
              </tr>
            </table>
          </td></tr>` +
          ctaButton("Manage Subscription →", `${appUrl}/dashboard/subscriptions`, true) +
          bodyText("Bento keeps track of every subscription so you never pay for something you forgot about.")
      )
  );
  return { subject, html };
}

export interface ChurnPreventionParams {
  name: string;
  daysSinceLastVisit: number;
  appUrl: string;
}

export function churnPreventionTemplate({ name, daysSinceLastVisit, appUrl }: ChurnPreventionParams): { subject: string; html: string } {
  const subject =
    daysSinceLastVisit >= 30
      ? `We miss you, ${name} — your savings are still waiting`
      : `Still saving, ${name}? Don't leave money on the table`;

  const html = baseLayout(
    header(
      daysSinceLastVisit >= 30 ? "We've been keeping an eye out 👀" : "Haven't seen you in a bit!",
      `It's been ${daysSinceLastVisit} days since your last visit.`
    ) +
      bodySection(
        bodyText(`Hi ${name},`) +
          bodyText(
            daysSinceLastVisit >= 30
              ? `We know life gets busy. But Bento has been working behind the scenes — scanning for new savings, tracking renewals, and watching for price drops. There might be money waiting for you right now.`
              : `Just a friendly nudge! Bento keeps finding savings even when you're away — but you need to check in to claim them. A quick visit could mean real money back in your pocket.`
          ) +
          ctaButton("Check Your Savings →", `${appUrl}/dashboard`, true) +
          bodyText(
            "No pressure. Bento works on your terms — whenever you're ready, your savings dashboard is up to date and waiting."
          )
      ) +
      bodySection(
        `<tr><td style="font-size:13px;color:#94a3b8;text-align:center;padding-top:8px;">
          Want fewer emails? <a href="${appUrl}/dashboard/settings" style="color:#94a3b8;">Adjust your notification settings</a>.
        </td></tr>`
      )
  );
  return { subject, html };
}
