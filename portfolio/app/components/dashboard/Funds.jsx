"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatCurrency } from "../../lib/api";

export default function Funds({ userEmail, userInvestorId }) {
  const [funds, setFunds] = useState([]);
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFunds() {
      try {
        setLoading(true);
        setError("");

        const [fundsData, sipsData] = await Promise.all([
          apiFetch("/api/funds"),
          apiFetch("/api/sips/all"),
        ]);

        if (!cancelled) {
          setFunds(fundsData);
          setSips(sipsData);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load funds");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFunds();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasUserFilter = Boolean(userEmail || userInvestorId);
  const filteredSips = hasUserFilter
    ? sips.filter(
        (sip) =>
          sip.investor_email === userEmail ||
          (userInvestorId && sip.investor_id === userInvestorId),
      )
    : sips;
  const fundIds = new Set(filteredSips.map((sip) => sip.fund_id));
  const filteredFunds = hasUserFilter
    ? funds.filter((fund) => fundIds.has(fund.fund_id))
    : funds;

  return (
    <section className="rounded-4xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Products
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Funds</h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {filteredFunds.length} records
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
            Loading funds...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-8 text-sm text-rose-700">
            {error}
          </div>
        ) : filteredFunds.length ? (
          filteredFunds.map((fund) => (
            <article
              key={fund.fund_id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {fund.fund_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{fund.amc_name}</p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  NAV {formatCurrency(fund.current_nav)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <MetaPill label={fund.fund_type} />
                <MetaPill label={fund.risk_level} />
                <MetaPill label={`ID #${fund.fund_id}`} />
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">No funds found.</p>
        )}
      </div>
    </section>
  );
}

function MetaPill({ label }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">
      {label}
    </span>
  );
}
