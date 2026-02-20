import { Outlet } from "react-router-dom";
import { TenantProvider, useTenant } from "../context/TenantContext";

const TenantLayout = () => {
  const { isValidTenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking tenant...
      </div>
    );
  }

  if (!isValidTenant) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Invalid Tenant
      </div>
    );
  }

  return <Outlet />;
};

const TenantWrapper = () => {
  return (
    <TenantProvider>
      <TenantLayout />
    </TenantProvider>
  );
};

export default TenantWrapper;
