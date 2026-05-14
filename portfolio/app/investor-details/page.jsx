"use client";

import { useContext, useEffect, useState } from "react";
import ProfileContext from "../core/contexts/ProfileContext";
import {
  API_BASE_URL,
  authHeaders,
  formatCurrency,
  formatDate,
} from "../lib/api";

export default function InvestorDetailsPage() {
  const { storedDetails } = useContext(ProfileContext);
  const [investor, setInvestor] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [netWorth, setNetWorth] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const investorId = storedDetails?.user?.investor_id;

  useEffect(() => {
    if (!investorId || !storedDetails?.token) {
      setStatus("ready");
      return;
    }

    let cancelled = false;

    async function loadInvestorDetails() {
      try {
        setStatus("loading");
        setError("");

        const headers = authHeaders();

        const [investorResponse, holdingsResponse, netWorthResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/api/investor/${investorId}`, { headers }),
            fetch(`${API_BASE_URL}/api/investor/${investorId}/holdings`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/api/investor/${investorId}/networth`, {
              headers,
            }),
          ]);

        const investorData = await investorResponse.json();
        const holdingsData = await holdingsResponse.json();
        const netWorthData = await netWorthResponse.json();

        if (!cancelled) {
          setInvestor(investorData);
          setHoldings(Array.isArray(holdingsData) ? holdingsData : []);
          setNetWorth(netWorthData);
          setStatus("ready");
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load investor details");
          setStatus("error");
        }
      }
    }

    loadInvestorDetails();

    return () => {
      cancelled = true;
    };
  }, [investorId, storedDetails?.token]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3f5f9_0%,#eef2f7_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Investor profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {storedDetails?.user
              ? `${storedDetails.user.first_name} ${storedDetails.user.last_name}`
              : "Investor details"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Protected profile data, holdings, and net worth pulled from the API.
          </p>
        </section>

        {status === "loading" ? (
          <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Loading investor data...
          </div>
        ) : error ? (
          <div className="rounded-4xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {error}
          </div>
        ) : storedDetails ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
            <section className="rounded-4xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Account summary
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  label="Investor ID"
                  value={
                    investor?.investor_id ?? storedDetails.user.investor_id
                  }
                />
                <InfoCard
                  label="Email"
                  value={investor?.email ?? storedDetails.user.email}
                />
                <InfoCard
                  label="Phone"
                  value={investor?.phone ?? storedDetails.user.phone}
                />
                <InfoCard
                  label="Occupation"
                  value={investor?.occupation ?? storedDetails.user.occupation}
                />
                <InfoCard
                  label="PAN"
                  value={investor?.pan ?? storedDetails.user.pan}
                />
                <InfoCard
                  label="Date of birth"
                  value={formatDate(investor?.dob ?? storedDetails.user.dob)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-4xl bg-slate-900 p-6 text-white shadow-sm">
                <p className="text-sm text-slate-300">Net worth</p>
                <p className="mt-2 text-3xl font-semibold">
                  {netWorth?.networth
                    ? formatCurrency(netWorth.networth)
                    : "₹0.00"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {netWorth?.investor_name ?? storedDetails.user.first_name}
                </p>
              </div>

              <div className="rounded-4xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Holdings
                </h2>

                <div className="mt-4 space-y-3">
                  {holdings.length ? (
                    holdings.map((holding) => (
                      <div
                        key={holding.fund_id}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {holding.fund_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {Number(holding.total_units || 0).toFixed(2)} units
                            at {formatCurrency(holding.current_nav)} NAV
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(holding.current_value)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No holdings found for this investor.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            No investor session found.
          </div>
        )}
      </div>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 wrap-break-word text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}
