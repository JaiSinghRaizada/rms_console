import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "../api/userApi";

const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const [organizationId, setOrganizationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrganizationId = async () => {
      try {
        // 🔑 matches localStorage & JWT
        const userSub = localStorage.getItem("userSub");

        if (!userSub) {
          console.error("userSub not found in localStorage");
          return;
        }

        // ✅ CORRECT FUNCTION NAME
        const user = await userApi.getByUserSub(userSub);

        if (!user.organizationId) {
          console.error("User has no organization assigned");
          return;
        }

        setOrganizationId(user.organizationId);
      } catch (err) {
        console.error("Failed to load user organization", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationId();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{ organizationId, loading }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);
