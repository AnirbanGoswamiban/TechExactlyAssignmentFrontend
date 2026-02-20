import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/sidebar/sidebar.css";

const Sidebar = () => {
  const { tenant } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.clear();
  setUser(null);
  navigate(`/${tenant}/login`, { replace: true });
};


  return (
    <div className="sidebar">
      <h1 className="sidebar-title">{tenant}</h1>

      <nav className="sidebar-nav">
        <NavLink to={`/${tenant}/dashboard`} className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to={`/${tenant}/products`} className="sidebar-link">
          Products
        </NavLink>

        <NavLink to={`/${tenant}/orders`} className="sidebar-link">
          Orders
        </NavLink>

        <NavLink to={`/${tenant}/purchase-orders`} className="sidebar-link">
          Purchase Orders
        </NavLink>

        <NavLink to={`/${tenant}/suppliers`} className="sidebar-link">
          Suppliers
        </NavLink>

        <NavLink to={`/${tenant}/users`} className="sidebar-link">
          Users
        </NavLink>

        {user?.role === "Owner" && (
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
