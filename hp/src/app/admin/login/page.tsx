import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata = { title: "管理者ログイン" };

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold text-slate-900">管理画面ログイン</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          パスワードを入力してください
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
