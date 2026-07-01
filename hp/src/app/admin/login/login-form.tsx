"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
