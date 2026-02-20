import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import api from "../services/api";
import "../assets/dashboard/dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    inventoryValue: 0,
    lowStockCount: 0
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchLowStock();
    fetchTopProducts();
  }, []);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    tenant: localStorage.getItem("tenant")
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/dashboard/summary", { headers });
      if (res.data.success) setSummary(res.data);
    } catch (err) {
      console.error("Summary fetch error", err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await api.get("/api/dashboard/low-stock", { headers });
      if (res.data.success) setLowStockItems(res.data.data);
    } catch (err) {
      console.error("Low stock fetch error", err);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await api.get("/api/dashboard/top-products", { headers });
      if (res.data.success) setTopProducts(res.data.data);
    } catch (err) {
      console.error("Top products fetch error", err);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="stats-grid">
          <StatsCard title="Inventory Value" value={`₹ ${summary.inventoryValue}`} />
          <StatsCard title="Low Stock Items" value={summary.lowStockCount} />
          <StatsCard title="Top Sellers" value={`${topProducts.length} Products`} />
          <StatsCard title="Pending Orders" value="—" />
        </div>

        {/* Low Stock Table */}
        <div className="table-card">
          <h3>Low Stock Items</h3>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-text">
                    No low stock items 🎉
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item) => (
                  <tr key={item.variant?._id}>
                    <td>{item.name}</td>
                    <td>
                      {item.variant?.attributes?.color || "-"} /{" "}
                      {item.variant?.attributes?.size || "-"}
                    </td>
                    <td className="stock-low">{item.variant?.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="table-card">
          <h3>Top Selling Products</h3>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold Qty</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan="2" className="empty-text">
                    No sales data yet
                  </td>
                </tr>
              ) : (
                topProducts.map((item) => (
                  <tr key={item._id}>
                    <td>{item.product?.name}</td>
                    <td className="sold-qty">{item.totalSold}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
