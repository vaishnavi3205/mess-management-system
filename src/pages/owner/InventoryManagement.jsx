import React, { useState, useMemo } from "react";
import "./InventoryManagement.css";

function InventoryManagement() {
  const LOW_STOCK_LIMIT = 50;

  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    cost: "",
    category: "Vegetables",
  });

  // 🔹 Calculations
  const totalItems = items.length;

  const totalValue = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );
  }, [items]);

  const lowStockItems = useMemo(() => {
    return items.filter((item) => item.quantity < LOW_STOCK_LIMIT);
  }, [items]);

  const filteredItems =
    categoryFilter === "All"
      ? items
      : items.filter((item) => item.category === categoryFilter);

  // ➕ Add Item
  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.cost)
      return alert("Fill all fields");

    setItems([...items, { ...newItem, quantity: Number(newItem.quantity), cost: Number(newItem.cost) }]);
    setShowAddModal(false);
    setNewItem({ name: "", quantity: "", unit: "kg", cost: "", category: "Vegetables" });
  };

  // 🔄 Update Quantity
  const updateQuantity = (id, newQty) => {
    setItems(
      items.map((item, index) =>
        index === id ? { ...item, quantity: Number(newQty) } : item
      )
    );
    setUpdateItem(null);
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Track and manage stock levels</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="card">
          <p>Total Items</p>
          <h2>{totalItems}</h2>
        </div>
        <div className="card">
          <p>Total Inventory Value</p>
          <h2>₹{totalValue.toLocaleString()}</h2>
        </div>
        <div className="card low">
          <p>Low Stock Items</p>
          <h2>{lowStockItems.length}</h2>
        </div>
      </div>

      {/* Category Filters */}
      <div className="filters">
        {["All", "Vegetables", "Grains", "Others"].map((cat) => (
          <button
            key={cat}
            className={categoryFilter === cat ? "active" : ""}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Cost/Unit</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => {
              const total = item.quantity * item.cost;
              const isLow = item.quantity < LOW_STOCK_LIMIT;

              return (
                <tr key={index} className={isLow ? "low-row" : ""}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.cost}</td>
                  <td>₹{total}</td>
                  <td>
                    <span className={isLow ? "badge low-badge" : "badge in-badge"}>
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => setUpdateItem({ index, ...item })}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="alert-box">
          <h4>⚠ Low Stock Alert</h4>
          <div className="alert-items">
            {lowStockItems.map((item, index) => (
              <span key={index}>
                {item.name} ({item.quantity} {item.unit})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Inventory Item</h3>
            <input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Cost per Unit"
              value={newItem.cost}
              onChange={(e) =>
                setNewItem({ ...newItem, cost: e.target.value })
              }
            />
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            >
              <option>Vegetables</option>
              <option>Grains</option>
              <option>Others</option>
            </select>

            <div className="modal-buttons">
              <button onClick={addItem}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Quantity</h3>
            <input
              type="number"
              defaultValue={updateItem.quantity}
              onBlur={(e) =>
                updateQuantity(updateItem.index, e.target.value)
              }
            />
            <button onClick={() => setUpdateItem(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;