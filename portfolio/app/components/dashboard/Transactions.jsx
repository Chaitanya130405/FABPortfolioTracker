"use client";

import { useEffect, useState } from "react";
import { apiFetch, formatCurrency, formatDate } from "../../lib/api";

export default function Transactions({ userEmail, userInvestorId }) {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/transactions");

        if (!cancelled) {
          setTransactions(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load transactions");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      String(transaction.portfolio_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(transaction.fund_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(transaction.transaction_type || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.transaction_id.toString().includes(searchTerm),
  );

  const scopedTransactions =
    userEmail || userInvestorId
      ? filteredTransactions.filter(
          (transaction) =>
            transaction.investor_email === userEmail ||
            (userInvestorId && transaction.investor_id === userInvestorId),
        )
      : filteredTransactions;

  return (
    <section className="rounded-4xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Records
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Investment Transactions
          </h2>
        </div>

        <input
          placeholder="Search portfolio, fund, type, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 sm:max-w-md"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
        {loading ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            Loading transactions...
          </div>
        ) : error ? (
          <div className="bg-rose-50 px-5 py-8 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Portfolio</th>
                  <th className="px-5 py-4">Fund</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-right">NAV</th>
                  <th className="px-5 py-4 text-right">Units</th>
                  <th className="px-5 py-4 text-right">Date</th>
                  <th className="px-5 py-4 text-right">Type</th>
                </tr>
              </thead>

              <tbody>
                {scopedTransactions.length ? (
                  scopedTransactions.map((transaction) => (
                    <tr
                      key={transaction.transaction_id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        #{transaction.transaction_id}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {transaction.portfolio_name}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {transaction.fund_name}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-900">
                        {formatCurrency(transaction.transaction_amount)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600">
                        {formatCurrency(transaction.nav_at_purchase)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600">
                        {Number(transaction.units_allocated || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600">
                        {formatDate(transaction.transaction_date)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {transaction.transaction_type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-5 py-6 text-sm text-slate-500"
                      colSpan={8}
                    >
                      No transactions match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
