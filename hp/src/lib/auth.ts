import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "hp_admin_session";
const PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SECRET = process.env.ADMIN_SECRET || "change-this-secret-in-production";

// パスワードとシークレットから決まる固定トークン。Cookie にはこの値だけを保存する。
function sessionToken(): string {
  return createHash("sha256").update(`${PASSWORD}:${SECRET}`).digest("hex");
}

export function checkPassword(input: string): boolean {
  return input.length > 0 && input === PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === sessionToken();
}

// Server Action / Route Handler 内でのみ呼ぶこと（レンダリング中は Cookie を書けない）
export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8時間
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
