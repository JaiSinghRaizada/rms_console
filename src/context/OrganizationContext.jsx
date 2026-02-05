import { createContext, useContext, useEffect, useState } from "react";

const OrganizationContext = createContext(null);

export function OrganizationProvider({ children }) {
  const [organizationId, setOrganizationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔑 SINGLE SOURCE OF TRUTH
    const storedOrgId = localStorage.getItem("organizationId");

    if (storedOrgId) {
      setOrganizationId(storedOrgId);
    } else {
      setOrganizationId(null);
    }

    setLoading(false);
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organizationId,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
}
