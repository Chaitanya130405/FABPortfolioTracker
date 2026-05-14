"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatDate } from "../../lib/api";

export default function Portfolios({ userEmail, userInvestorId }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolios() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/portfolios");

        if (!cancelled) {
          setPortfolios(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load portfolios");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPortfolios();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPortfolios =
    userEmail || userInvestorId
      ? portfolios.filter(
          (portfolio) =>
            portfolio.email === userEmail ||
            (userInvestorId && portfolio.investor_id === userInvestorId),
        )
      : portfolios;

  return (
    <section className="rounded-4xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Structure
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Portfolios
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {filteredPortfolios.length} records
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
        {loading ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            Loading portfolios...
          </div>
        ) : error ? (
          <div className="bg-rose-50 px-5 py-8 text-sm text-rose-700">
            {error}
          </div>
        ) : filteredPortfolios.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Portfolio</th>
                  <th className="px-5 py-4">Investor</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4 text-right">Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredPortfolios.map((portfolio) => (
                  <tr
                    key={portfolio.portfolio_id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {portfolio.portfolio_name}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {portfolio.first_name} {portfolio.last_name}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {portfolio.email}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {portfolio.phone}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-600">
                      {formatDate(portfolio.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-slate-500">
            No portfolios found.
          </div>
        )}
      </div>
    </section>
  );
}
