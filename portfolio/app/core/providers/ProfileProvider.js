"use client";
import ProfileContext from "../contexts/ProfileContext";
import { useEffect, useState } from "react";
import {
  clearAuthSession,
  getStoredAuthSession,
  setAuthSession,
} from "../../lib/auth";

export default function ProfileProvider({ children }) {
  const [storedDetails, setStoredDetails] = useState(null);

  useEffect(() => {
    const savedSession = getStoredAuthSession();

    if (savedSession) {
      setStoredDetails(savedSession);
    }
  }, []);

  function storeInvestorData(data) {
    setAuthSession(data);
    setStoredDetails(data);
  }

  function clearInvestorData() {
    clearAuthSession();
    setStoredDetails(null);
  }

  return (
    <ProfileContext.Provider
      value={{ storedDetails, storeInvestorData, clearInvestorData }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
