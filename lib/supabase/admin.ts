import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Untyped admin client — avoids the `never[]` inference issues
 * that occur with the typed Database generic on complex queries.
 * Use this for route handlers and server components that do dynamic
 * selects/inserts where TypeScript inference breaks.
 */
export function createUntypedAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
