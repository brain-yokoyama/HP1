import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// サーバー専用。service_role キーは RLS をバイパスするためブラウザに絶対渡さないこと。
let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_URL.includes("YOUR-PROJECT"),
  );
}

export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。",
    );
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
