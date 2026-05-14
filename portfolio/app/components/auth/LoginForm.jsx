"use client";

import React, { useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound, LoaderCircle, LockKeyhole } from "lucide-react";
import ProfileContext from "../../core/contexts/ProfileContext";
import { apiFetch } from "../../lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { storeInvestorData } = useContext(ProfileContext);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      setError("");
      try {
        const result = await apiFetch("/api/investor/login", {
          method: "POST",
          body: JSON.stringify({ email, phone }),
        });

        storeInvestorData(result);
        router.replace("/dashboard");
      } catch (loginError) {
        setError(loginError.message || "Unable to sign in");
      } finally {
        setLoading(false);
      }
    },
    [email, phone, storeInvestorData, router],
  );

  return (
      <form
        className="w-full max-w-md space-y-5 rounded-4xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-slate-300/40 sm:p-8 lg:p-10"
        onSubmit={handleSubmit}
        >
        <h1 className="text-center text-2xl font-bold">login</h1>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Email address
          </span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-400 focus-within:bg-white">
            <CircleUserRound className="text-slate-400" size={18} />
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="investor@company.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-400 focus-within:bg-white">
            <LockKeyhole className="text-slate-400" size={18} />
            <input
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoaderCircle className="animate-spin" size={18} /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
  );
}
