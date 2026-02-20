import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { tenant } = useParams();
  const [isValidTenant, setIsValidTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;

    const checkTenant = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
        //   `${VITE_API_BASE_URL}/tenantCheck?dbName=${tenant}`
        `${import.meta.env.VITE_API_BASE_URL}/tenantCheck?dbName=${tenant}`
        );
        if (res.data.message==="true") {
          setIsValidTenant(true);
        } else {
          setIsValidTenant(false);
        }
      } catch (err) {
        setIsValidTenant(false);
      } finally {
        setLoading(false);
      }
    };

    checkTenant();
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ isValidTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
