import { useParams } from "react-router-dom";
import { dummyTenants } from "../data/dummyData";

const useTenantData = () => {
  const { tenant } = useParams();

  return dummyTenants[tenant] || null;
};

export default useTenantData;
