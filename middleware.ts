import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function logPageview(request: NextRequest): Promise<void> {
  const path = request.nextUrl.pathname;
  const referrer = request.headers.get("referer") ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  // Hash the IP for rough unique counting without storing raw IPs
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "0.0.0.0";
  const ipHash = await sha256(ip);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Fire-and-forget: do NOT await, do NOT block the response.
  // We use .then() with two callbacks instead of .catch() because
  // Supabase's insert returns a PromiseLike, not a full Promise.
  void supabase
    .from("analytics_pageviews")
    .insert({
      path,
      referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
    })
    .then(
      ({ error }) => {
        if (error) console.warn("[analytics] insert error:", error.message);
      },
      (err: unknown) => {
        console.warn("[analytics] unexpected error:", err);
      }
    );
}

export async function middleware(request: NextRequest) {
  // Fire-and-forget pageview logging — do NOT await, do NOT block the response
  void logPageview(request);

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/assets)
     * - api routes (let them handle auth internally)
     * - static file extensions (.js, .css, .ico, .woff, .woff2)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico|woff|woff2)$|api/).*)",
  ],
};
