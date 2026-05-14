"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatCurrency, formatDate } from "../../lib/api";

export default function Payments({ userEmail, userInvestorId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPayments() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/sips/all");

        if (!cancelled) {
          const hasUserFilter = Boolean(userEmail || userInvestorId);
          const scoped = hasUserFilter
            ? data.filter(
                (sip) =>
                  sip.investor_email === userEmail ||
                  (userInvestorId && sip.investor_id === userInvestorId),
              )
            : data;

          setPayments(scoped.slice(-4).reverse());
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load recent SIPs");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-4xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Activity
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Recent SIPs
          </h2>
        </div>

        <p className="text-sm text-slate-500">
          Latest registrations and amounts
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            Loading recent SIPs...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">
            {error}
          </div>
        ) : payments.length ? (
          payments.map((sip) => (
            <article
              key={sip.sip_id}
              className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {sip.portfolio_name}
                </p>
                <p className="text-xs text-slate-500">{sip.fund_name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(sip.start_date)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-base font-semibold text-slate-900">
                  {formatCurrency(sip.sip_amount)}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {sip.status}
                </span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No SIPs have been registered yet.
          </p>
        )}
      </div>
    </section>
  );
}
