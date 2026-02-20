import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/suppliers/supplier.css";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          tenant: localStorage.getItem("tenant")
        }
      });

      if (res.data.success) {
        setSuppliers(res.data.suppliers);
      }
    } catch (err) {
      console.error("Fetch suppliers error", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      isActive: true
    });
  };

  const createSupplier = async () => {
    if (!formData.name) {
      return alert("Supplier name is required");
    }

    try {
      const res = await api.post("/api/suppliers", formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          tenant: localStorage.getItem("tenant")
        }
      });

      if (res.data.success) {
        fetchSuppliers();
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error("Create supplier error", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create supplier");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="suppliers-container">
        <div className="suppliers-header">
          <h2>Suppliers</h2>

          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Create Supplier
          </button>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier.name}</td>
                <td>{supplier.email || "-"}</td>
                <td>{supplier.phone || "-"}</td>

                <td>
                  {supplier.isActive ? (
                    <span className="active">Active</span>
                  ) : (
                    <span className="inactive">Inactive</span>
                  )}
                </td>

                <td>
                  {new Date(supplier.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal modal-scroll">
              <h3>Create Supplier</h3>

              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="modal-buttons">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button onClick={createSupplier} className="btn-primary">
                  Create Supplier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
