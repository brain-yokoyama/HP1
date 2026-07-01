import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { logout } from "./actions";
import Editor from "./editor";

export const metadata = { title: "サイト内容の編集 | 管理画面" };

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const content = await getContent();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-slate-900">サイト内容の編集</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              サイトを表示 ↗
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Editor initial={content} />
      </main>
    </div>
  );
}
