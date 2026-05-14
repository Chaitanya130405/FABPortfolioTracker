"use client";

import React, { useContext, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashHeader from "../components/layout/DashHeader";
import Cards from "../components/dashboard/Cards";
import Funds from "../components/dashboard/Funds";
import Investors from "../components/dashboard/Investors";
import Portfolios from "../components/dashboard/Portfolios";
import Payments from "../components/dashboard/Payments";
import Transactions from "../components/dashboard/Transactions";
import ProfileContext from "../core/contexts/ProfileContext";

export default function Dashboard() {
  const { storedDetails, clearInvestorData } = useContext(ProfileContext);
  const router = useRouter();

  const user = storedDetails?.user ?? null;
  const userEmail = user?.email ?? "";
  const userInvestorId = user?.investor_id ?? null;
  const isAuthenticated = Boolean(userInvestorId);

  const handleLogout = useCallback(() => {
    clearInvestorData();
    router.replace("/login");
  }, [clearInvestorData, router]);

  // Redirect to login if not authenticated. Performed in an effect
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3f5f9_0%,#edf1f7_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashHeader user={user} onLogout={handleLogout} />

        <Cards userEmail={userEmail} userInvestorId={userInvestorId} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Payments userEmail={userEmail} userInvestorId={userInvestorId} />

          <div className="grid gap-6">
            <Portfolios userEmail={userEmail} userInvestorId={userInvestorId} />
            <Investors userEmail={userEmail} />
            <Funds userEmail={userEmail} userInvestorId={userInvestorId} />
          </div>
        </div>

        <Transactions userEmail={userEmail} userInvestorId={userInvestorId} />
      </div>
    </main>
  );
}
