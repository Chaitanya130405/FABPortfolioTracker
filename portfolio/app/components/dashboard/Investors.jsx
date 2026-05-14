"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatDate } from "../../lib/api";

export default function Investors({ userEmail }) {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInvestors() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/investors");

        if (!cancelled) {
          setInvestors(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load investors");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInvestors();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredInvestors = userEmail
    ? investors.filter((investor) => investor.email === userEmail)
    : investors;

  return (
    <section className="rounded-4xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            People
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Investors
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {filteredInvestors.length} records
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
        {loading ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            Loading investors...
          </div>
        ) : error ? (
          <div className="bg-rose-50 px-5 py-8 text-sm text-rose-700">
            {error}
          </div>
        ) : filteredInvestors.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Investor</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Occupation</th>
                  <th className="px-5 py-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvestors.map((investor) => (
                  <tr
                    key={investor.investor_id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {investor.first_name} {investor.last_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID #{investor.investor_id}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {investor.email}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {investor.phone}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {investor.occupation || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(investor.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-slate-500">
            No investors found.
          </div>
        )}
      </div>
    </section>
  );
}
