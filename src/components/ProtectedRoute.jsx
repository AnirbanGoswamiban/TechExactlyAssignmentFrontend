import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { tenant } = useParams();

  if (!user) {
    return <Navigate to={`/${tenant}/login`} />;
  }

  return children;
};

export default ProtectedRoute;
