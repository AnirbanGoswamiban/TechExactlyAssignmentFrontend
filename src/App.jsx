import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import PurchaseOrders from "./pages/PurchaseOrders";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import TenantWrapper from "./components/TenantWrapper";

function App() {
  return (
    <Routes>
  <Route path="/:tenant" element={<TenantWrapper />}>

    <Route path="login" element={<Login />} />

    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route path="products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
    <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
    <Route path="suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
    <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

  </Route>
</Routes>
  );
}

export default App;
