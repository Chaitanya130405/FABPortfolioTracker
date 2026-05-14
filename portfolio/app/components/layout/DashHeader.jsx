"use client";

import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";

export default function DashHeader({ user, onLogout }) {
  const displayName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "Guest investor";

  return (
    <header className="flex flex-col gap-4 rounded-4xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <ShieldCheck size={14} />
          Protected session
        </div>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Analytics Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Investors, funds, and SIPs in one simple overview.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UserCircle2 size={18} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email ?? "No email loaded"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
