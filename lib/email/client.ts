import { Resend } from "resend";

let _resend: Resend | null = null;

/**
 * Lazy-initialized Resend client. Use this instead of the eager singleton
 * to avoid build failures when RESEND_API_KEY is missing at compile time.
 */
export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

export const EMAIL_FROM = "Bento <hello@bento.app>";
