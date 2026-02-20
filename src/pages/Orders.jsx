import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/orders/orders.css";

const Orders = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { product: "", variantId: "", quantity: 1, type: "sale" }
  ]);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    tenant: localStorage.getItem("tenant")
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await api.get("/api/orders", { headers });
      if (res.data.success) {
        setMovements(res.data.order);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products", { headers });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addRow = () => {
    setItems([
      ...items,
      { product: "", variantId: "", quantity: 1, type: "sale" }
    ]);
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const submit = async () => {
    for (const item of items) {
      if (!item.product || !item.variantId || !item.quantity) {
        return alert("Please fill all fields");
      }
    }

    const formattedItems = items.map((i) => ({
      productId: i.product,
      variantId: i.variantId,
      quantity: i.quantity,
      type: i.type
    }));

    try {
      setLoading(true);
      const res = await api.post(
        "/api/orders",
        { items: formattedItems },
        { headers }
      );

      if (res.data.success) {
        setShowModal(false);
        setItems([
          { product: "", variantId: "", quantity: 1, type: "sale" }
        ]);
        fetchMovements();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating movement");
    } finally {
      setLoading(false);
    }
  };

  const reverseMovement = async (id) => {
    if (!window.confirm("Reverse this movement?")) return;

    try {
      await api.patch(`/api/orders/${id}/cancel`, {}, { headers });
      fetchMovements();
    } catch (err) {
      alert(err.response?.data?.message || "Error reversing movement");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <div className="page-header">
          <h2>Stock Movements</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Movement
          </button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Previous</th>
                <th>New</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-text">
                    No movements found
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m._id}>
                    <td>{m._id.slice(-6)}</td>
                    <td>{m.product?.name || "-"}</td>
                    <td>
                      <span className={`status ${m.type}`}>
                        {m.type}
                      </span>
                    </td>
                    <td>{m.quantity}</td>
                    <td>{m.previousStock}</td>
                    <td>{m.newStock}</td>
                    <td>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {(m.type === "sale" || m.type === "purchase") && (
                        <button
                          className="btn-danger"
                          onClick={() => reverseMovement(m._id)}
                        >
                          Reverse
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Stock Movement</h3>
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
                          {v.sku} — {v.attributes?.size} / {v.attributes?.color}
                        </option>
                      ))}
                  </select>

                  <select
                    value={item.type}
                    onChange={(e) =>
                      updateItem(i, "type", e.target.value)
                    }
                  >
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
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

              <button
                className="submit-order-btn"
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Movement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;