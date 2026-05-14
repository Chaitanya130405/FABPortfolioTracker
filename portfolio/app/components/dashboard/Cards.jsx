"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatCurrency } from "../../lib/api";

export default function Cards({ userEmail, userInvestorId }) {
  const [stats, setStats] = useState({ investors: [], funds: [], sips: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const [investors, funds, sips] = await Promise.all([
          apiFetch("/api/investors"),
          apiFetch("/api/funds"),
          apiFetch("/api/sips/all"),
        ]);

        if (!cancelled) {
          setStats({ investors, funds, sips });
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasUserFilter = Boolean(userEmail || userInvestorId);

  const filteredInvestors = hasUserFilter
    ? stats.investors.filter((investor) => investor.email === userEmail)
    : stats.investors;

  const filteredSips = hasUserFilter
    ? stats.sips.filter(
        (sip) =>
          sip.investor_email === userEmail ||
          (userInvestorId && sip.investor_id === userInvestorId),
      )
    : stats.sips;

  const fundIds = new Set(filteredSips.map((sip) => sip.fund_id));
  const filteredFunds = hasUserFilter
    ? stats.funds.filter((fund) => fundIds.has(fund.fund_id))
    : stats.funds;

  const totalAmount = filteredSips.reduce(
    (sum, sip) => sum + Number(sip.sip_amount || 0),
    0,
  );

  const activeSips = filteredSips.filter((sip) =>
    String(sip.status || "")
      .toLowerCase()
      .includes("active"),
  ).length;

  const totalNav = filteredFunds.reduce(
    (sum, fund) => sum + Number(fund.current_nav || 0),
    0,
  );

  const averageSip = filteredSips.length
    ? totalAmount / filteredSips.length
    : 0;

  return (
    <section className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Overview
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            API snapshot
          </h2>
        </div>

        <p className="text-sm text-slate-500">
          Investors, funds, and SIPs pulled from the backend.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          Loading summary cards...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Investors"
            value={filteredInvestors.length}
            helper="Registered accounts"
          />
          <StatCard
            label="Funds"
            value={filteredFunds.length}
            helper={`NAV total ${formatCurrency(totalNav)}`}
          />
          <StatCard
            label="SIPs"
            value={filteredSips.length}
            helper={`${activeSips} active registrations`}
          />
          <StatCard
            label="Total SIP amount"
            value={formatCurrency(totalAmount)}
            helper={`Average ${formatCurrency(averageSip)}`}
            accent
          />
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, helper, accent = false }) {
  return (
    <div
      className={`rounded-3xl p-5 shadow-sm ${
        accent
          ? "bg-gradient-to-br from-cyan-500 to-emerald-500 text-white"
          : "border border-slate-200 bg-slate-50"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent ? "text-white/80" : "text-slate-500"}`}
      >
        {label}
      </p>
      <p
        className={`mt-3 text-2xl font-semibold ${accent ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p
        className={`mt-2 text-sm ${accent ? "text-white/80" : "text-slate-500"}`}
      >
        {helper}
      </p>
    </div>
  );
}
