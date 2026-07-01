"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import { saveContent, type Content } from "@/lib/content";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "パスワードが正しくありません。" };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function saveAction(data: Content): Promise<{ ok: boolean }> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  await saveContent(data);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
