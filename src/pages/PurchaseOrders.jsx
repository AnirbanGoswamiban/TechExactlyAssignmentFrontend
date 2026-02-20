import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useTenantData from "../hooks/useTenantData";

const PurchaseOrders = () => {
  const data = useTenantData();

  const [purchaseOrders, setPurchaseOrders] = useState(
    data?.purchaseOrders || []
  );

  const [products, setProducts] = useState(data?.products || []);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  if (!data) return <div>Tenant not found</div>;

  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productName: p.name
    }))
  );

  const addItem = (sku) => {
    const variant = allVariants.find((v) => v.sku === sku);
    if (!variant) return;

    const exists = cart.find((item) => item.sku === sku);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.sku === sku
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          sku: variant.sku,
          productName: variant.productName,
          quantity: 1,
          cost: variant.price * 0.7 // assume supplier cost
        }
      ]);
    }
  };

  const createPO = () => {
    const newPO = {
      id: Date.now(),
      supplierId: selectedSupplier,
      status: "Draft",
      items: cart,
      expectedDate: new Date().toISOString().split("T")[0]
    };

    setPurchaseOrders([...purchaseOrders, newPO]);
    setCart([]);
    setSelectedSupplier("");
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    setPurchaseOrders(
      purchaseOrders.map((po) =>
        po.id === id ? { ...po, status } : po
      )
    );
  };

  const receiveStock = (po) => {
    if (po.status !== "Confirmed") return;

    const updatedProducts = products.map((product) => {
      const updatedVariants = product.variants.map((variant) => {
        const poItem = po.items.find(
          (item) => item.sku === variant.sku
        );

        if (poItem) {
          return {
            ...variant,
            stock: variant.stock + poItem.quantity
          };
        }

        return variant;
      });

      return { ...product, variants: updatedVariants };
    });

    setProducts(updatedProducts);

    updateStatus(po.id, "Received");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Purchase Orders
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create PO
          </button>
        </div>

        {/* PO Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Expected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="border-t">
                  <td>{po.id}</td>
                  <td>{po.status}</td>
                  <td>{po.items.length}</td>
                  <td>{po.expectedDate}</td>
                  <td className="flex gap-2">
                    {po.status === "Draft" && (
                      <button
                        onClick={() =>
                          updateStatus(po.id, "Sent")
                        }
                        className="text-blue-600"
                      >
                        Send
                      </button>
                    )}

                    {po.status === "Sent" && (
                      <button
                        onClick={() =>
                          updateStatus(po.id, "Confirmed")
                        }
                        className="text-green-600"
                      >
                        Confirm
                      </button>
                    )}

                    {po.status === "Confirmed" && (
                      <button
                        onClick={() => receiveStock(po)}
                        className="text-purple-600"
                      >
                        Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create PO Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white w-[600px] p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4">
                Create Purchase Order
              </h3>

              <select
                onChange={(e) =>
                  setSelectedSupplier(e.target.value)
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select Supplier</option>
                {data.suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => addItem(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Add SKU</option>
                {allVariants.map((v) => (
                  <option key={v.sku} value={v.sku}>
                    {v.productName} - {v.sku}
                  </option>
                ))}
              </select>

              <div className="mb-4">
                {cart.map((item) => (
                  <div
                    key={item.sku}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.sku} x {item.quantity}
                    </span>
                    <span>
                      ${item.cost * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={createPO}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;
