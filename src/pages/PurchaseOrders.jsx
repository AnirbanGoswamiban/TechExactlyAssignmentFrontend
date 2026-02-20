import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/orders/orders.css";

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([
    { product: "", variantId: "", quantity: 1, price: 0 }
  ]);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    tenant: localStorage.getItem("tenant")
  };

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    fetchPurchaseOrders();
    fetchProducts();
    fetchSuppliers();
  }, []);

  /* ===============================
     FETCH PURCHASE ORDERS
  =============================== */
  const fetchPurchaseOrders = async () => {
    try {
      const res = await api.get("/api/purchase-orders", { headers });
      if (res.data.success) {
        setPurchaseOrders(res.data.purchaseOrders);
      }
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
    }
  };

  /* ===============================
     FETCH PRODUCTS
  =============================== */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products", { headers });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  /* ===============================
     FETCH SUPPLIERS
  =============================== */
  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers", { headers });
      if (res.data.success) {
        setSuppliers(res.data.suppliers);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  /* ===============================
     ADD ITEM ROW
  =============================== */
  const addRow = () => {
    setItems([
      ...items,
      { product: "", variantId: "", quantity: 1, price: 0 }
    ]);
  };

  /* ===============================
     UPDATE ITEM FIELD
  =============================== */
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  /* ===============================
     CREATE PURCHASE ORDER
  =============================== */
  const submit = async () => {
    if (!supplier) return alert("Please select a supplier");

    for (const item of items) {
      if (
        !item.product ||
        !item.variantId ||
        !item.quantity ||
        !item.price
      ) {
        return alert("Please complete all item fields");
      }
    }

    const formattedItems = items.map((item) => ({
      product: item.product,
      variantId: item.variantId,
      quantityOrdered: item.quantity,
      quantityReceived: 0,
      price: item.price
    }));

    const totalAmount = formattedItems.reduce(
      (sum, i) => sum + i.quantityOrdered * i.price,
      0
    );

    const payload = {
      supplier,
      items: formattedItems,
      status: "confirmed",
      totalAmount
    };

    try {
      setLoading(true);

      const res = await api.post(
        "/api/purchase-orders",
        payload,
        { headers }
      );

      if (res.data.success) {
        setShowModal(false);
        setSupplier("");
        setItems([
          { product: "", variantId: "", quantity: 1, price: 0 }
        ]);
        fetchPurchaseOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating purchase order");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RECEIVE PURCHASE ORDER
  =============================== */
  const receivePO = async (po) => {
    if (!window.confirm("Receive this Purchase Order?")) return;

    const receiveItems = po.items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantityOrdered - item.quantityReceived
    }));

    try {
      await api.patch(
        `/api/purchase-orders/${po._id}/receive`,
        { items: receiveItems },
        { headers }
      );

      fetchPurchaseOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error receiving purchase order");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <div className="page-header">
          <h2>Purchase Orders</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Purchase Order
          </button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Total Items</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-text">
                    No Purchase Orders Found
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po._id}>
                    <td>{po._id.slice(-6)}</td>
                    <td>{po.supplier?.name || "-"}</td>
                    <td>
                      <span className={`status ${po.status}`}>
                        {po.status}
                      </span>
                    </td>
                    <td>{po.items?.length}</td>
                    <td>₹ {po.totalAmount?.toFixed(2)}</td>
                    <td>
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {po.status !== "received" && (
                        <button
                          className="btn-success"
                          onClick={() => receivePO(po)}
                        >
                          Receive
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
              <h3>Create Purchase Order</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

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
                          {v.sku}
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(i, "quantity", Number(e.target.value))
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(i, "price", Number(e.target.value))
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
                {loading ? "Processing..." : "Create Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;