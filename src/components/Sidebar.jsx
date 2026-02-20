import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/sidebar/sidebar.css";

const Sidebar = () => {
  const { tenant } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate(`/${tenant}/login`, { replace: true });
  };

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">{tenant}</h1>

      <nav className="sidebar-nav">

        {/* Dashboard - OWNER & MANAGER */}
        {(role === "OWNER" || role === "MANAGER") && (
          <NavLink to={`/${tenant}/dashboard`} className="sidebar-link">
            Dashboard
          </NavLink>
        )}

        {/* Products - All Roles */}
        <NavLink to={`/${tenant}/products`} className="sidebar-link">
          Products
        </NavLink>

        {/* Orders - All Roles */}
        <NavLink to={`/${tenant}/orders`} className="sidebar-link">
          Orders
        </NavLink>

        {/* Purchase Orders - OWNER & MANAGER */}
        {(role === "OWNER" || role === "MANAGER") && (
          <NavLink to={`/${tenant}/purchase-orders`} className="sidebar-link">
            Purchase Orders
          </NavLink>
        )}

        {/* Suppliers - OWNER & MANAGER */}
        {(role === "OWNER" || role === "MANAGER") && (
          <NavLink to={`/${tenant}/suppliers`} className="sidebar-link">
            Suppliers
          </NavLink>
        )}

        {/* Users - OWNER Only */}
        {role === "OWNER" && (
          <NavLink to={`/${tenant}/users`} className="sidebar-link">
            Users
          </NavLink>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </nav>
    </div>
  );
};

export default Sidebar;