import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/orders/orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([
    { product: "", variantId: "", quantity: 1 }
  ]);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    tenant: localStorage.getItem("tenant")
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get("/api/orders", { headers });
    if (res.data.success) setOrders(res.data.order);
  };

  const fetchProducts = async () => {
    const res = await api.get("/api/products", { headers });
    if (res.data.success) setProducts(res.data.products);
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    await api.patch(`/api/orders/${id}/cancel`, {}, { headers });
    fetchOrders();
  };

  const addRow = () => {
    setItems([...items, { product: "", variantId: "", quantity: 1,type:'sales' }]);
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const submit = async () => {
    for (const item of items) {
      if (!item.product || !item.variantId || !item.quantity) {
        return alert("Please select product, variant and quantity");
      }
    }

    const res = await api.post("/api/orders", { items }, { headers });

    if (res.data.success) {
      setShowModal(false);
      setItems([{ product: "", variantId: "", quantity: 1 }]);
      fetchOrders();
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <div className="page-header">
          <h2>Orders</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Create Order
          </button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-text">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.items.length}</td>
                    <td>
                      <span className={`status ${o.status}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {o.status === "pending" && (
                        <button
                          className="btn-danger"
                          onClick={() => cancelOrder(o._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Order</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {items.map((item, i) => (
                <div className="order-row" key={i}>
                  <select
                    value={item.product}
                    onChange={(e) =>
                      updateItem(i, "product", e.target.value)
                    }
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* <select
                    value={item.variantId}
                    onChange={(e) =>
                      updateItem(i, "variantId", e.target.value)
                    }
                    disabled={!item.product}
                  >
                    <option value="">Select Variant</option>

                    {products
                      .find((p) => p._id === item.product)
                      ?.variants?.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.sku ||
                            `${v.attributes?.size || ""} ${v.attributes?.color || ""}`}
                        </option>
                      ))}
                  </select> */}

                  <select
                    value={item.variantId}
                    onChange={(e) =>
                      updateItem(i, "variantId", e.target.value)
                    }
                    disabled={!item.product}
                  >
                    <option value="">Select Variant</option>

                    {products
                      .find((p) => p._id === item.product)
                      ?.variants?.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.sku} — {v.attributes.size} / {v.attributes.color}
                        </option>
                      ))}
                  </select>



                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(i, "quantity", Number(e.target.value))
                    }
                  />
                </div>
              ))}

              <button className="add-item-btn" onClick={addRow}>
                + Add Item
              </button>

              <button className="submit-order-btn" onClick={submit}>
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
