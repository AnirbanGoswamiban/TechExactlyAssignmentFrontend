import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../assets/product/product.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  variants: [
    {
      sku: "",
      attributes: { size: "", color: "", style: "" },
      price: "",
      stock: "",
      minStock: 5
    }
  ]
});



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          tenant: localStorage.getItem("tenant"),
        },
      });

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleVariantChange = (field, value) => {
  const updated = [...formData.variants];
  updated[0][field] = value;
  setFormData({ ...formData, variants: updated });
};

const handleAttrChange = (field, value) => {
  const updated = [...formData.variants];
  updated[0].attributes[field] = value;
  setFormData({ ...formData, variants: updated });
};


const removeVariant = (index) => {
  const updated = [...formData.variants];
  updated.splice(index, 1);
  setFormData({ ...formData, variants: updated });
};


  const createProduct = async () => {
    try {
      const res = await api.post("/api/products", formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          tenant: localStorage.getItem("tenant"),
        },
      });

      if (res.data.success) {
        fetchProducts();
        setShowModal(false);
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
        });
      }
    } catch (err) {
      console.error("Create product error", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="products-container">
        <div className="products-header">
          <h2>Products</h2>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Create Product
          </button>
        </div>

        {/* <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>₹ {product.price}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <table className="products-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Status</th>
      <th>Variants</th>
      <th>Created</th>
    </tr>
  </thead>

  <tbody>
    {products.map((product) => (
      <tr key={product._id}>
        <td>{product.name}</td>
        <td>{product.description || "-"}</td>

        <td>
          {product.isActive ? (
            <span className="active">Available</span>
          ) : (
            <span className="inactive">Unavailable</span>
          )}
        </td>

        <td>{product.variants?.length || 0}</td>

        <td>
          {new Date(product.createdAt).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>


        {/* Modal */}
        {/* {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create Product</h3>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  onClick={createProduct}
                  className="btn-primary"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )} */}

        {showModal && (
  <div className="modal-overlay">
    <div className="modal modal-scroll">
      <h3>Create Product</h3>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <h4>Variant</h4>

      <input
        placeholder="SKU"
        value={formData.variants[0].sku}
        onChange={(e) =>
          handleVariantChange("sku", e.target.value)
        }
      />

      <div className="variant-row">
        <input
          placeholder="Size"
          value={formData.variants[0].attributes.size}
          onChange={(e) =>
            handleAttrChange("size", e.target.value)
          }
        />
        <input
          placeholder="Color"
          value={formData.variants[0].attributes.color}
          onChange={(e) =>
            handleAttrChange("color", e.target.value)
          }
        />
        <input
          placeholder="Style"
          value={formData.variants[0].attributes.style}
          onChange={(e) =>
            handleAttrChange("style", e.target.value)
          }
        />
      </div>

      <div className="variant-row">
        <input
          type="number"
          placeholder="Price"
          value={formData.variants[0].price}
          onChange={(e) =>
            handleVariantChange("price", e.target.value)
          }
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.variants[0].stock}
          onChange={(e) =>
            handleVariantChange("stock", e.target.value)
          }
        />
        <input
          type="number"
          placeholder="Min Stock"
          value={formData.variants[0].minStock}
          onChange={(e) =>
            handleVariantChange("minStock", e.target.value)
          }
        />
      </div>

      <div className="modal-buttons">
        <button
          onClick={() => setShowModal(false)}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button onClick={createProduct} className="btn-primary">
          Create Product
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default Products;
