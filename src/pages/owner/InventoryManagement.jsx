import { useState, useMemo } from "react";
import { useMess } from "../../context/MessContext";
import "./InventoryManagement.css";

function InventoryManagement() {
  const LOW_STOCK_LIMIT = 50;
  const { inventory: items, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useMess();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "kg", cost: "", category: "Vegetables" });

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.quantity || !newItem.cost) {
      alert("Please fill all fields");
      return;
    }
    await addInventoryItem({
      ...newItem,
      quantity: Number(newItem.quantity),
      cost: Number(newItem.cost),
      date: new Date().toLocaleDateString(),
    });
    setNewItem({ name: "", quantity: "", unit: "kg", cost: "", category: "Vegetables" });
  };

  const updateStock = async (id, currentQty) => {
    const newQty = prompt("Enter new quantity:", currentQty);
    if (newQty !== null && !isNaN(newQty)) {
      await updateInventoryItem(id, { quantity: Number(newQty) });
    }
  };

  const handleDelete = async (id) => {
    await deleteInventoryItem(id);
  };

  const filteredItems = useMemo(() => {
    if (categoryFilter === "All") return items;
    return items.filter((item) => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.cost, 0);
  const lowStockItems = items.filter((item) => item.quantity < LOW_STOCK_LIMIT);

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>
      <p className="subtitle">Track and manage stock levels</p>

      <div className="summary-grid">
        <div className="card"><h4>Total Items</h4><h2>{totalItems}</h2></div>
        <div className="card value-card"><h4>Total Value</h4><h2>₹{totalValue.toLocaleString()}</h2></div>
        <div className="card low-card"><h4>Low Stock</h4><h2>{lowStockItems.length}</h2></div>
      </div>

      <form className="inventory-form" onSubmit={handleAddItem}>
        <input type="text" placeholder="Item Name" value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
        <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
          <option value="kg">kg</option>
          <option value="liters">liters</option>
          <option value="pieces">pieces</option>
          <option value="packets">packets</option>
        </select>
        <input type="number" placeholder="Cost per Unit" value={newItem.cost}
          onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} />
        <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
          <option value="Others">Others</option>
        </select>
        <button type="submit">Add Item</button>
      </form>

      <div className="filter-tabs">
        {["All", "Vegetables", "Grains", "Others"].map((tab) => (
          <button key={tab} className={categoryFilter === tab ? "active" : ""} onClick={() => setCategoryFilter(tab)}>{tab}</button>
        ))}
      </div>

      <div className="item-list">
        {filteredItems.map((item) => {
          const total = item.quantity * item.cost;
          const isLow = item.quantity < LOW_STOCK_LIMIT;
          return (
            <div key={item.id} className={`item-card ${isLow ? "low-stock" : "in-stock"}`}>
              <div className="item-header">
                <h3>{item.name}</h3>
                <span className={isLow ? "badge low-badge" : "badge stock-badge"}>
                  {isLow ? "Low Stock" : "In Stock"}
                </span>
              </div>
              <p>Quantity: {item.quantity} {item.unit}</p>
              <p>Cost per Unit: ₹{item.cost}</p>
              <p>Total Value: ₹{total}</p>
              <p>Category: {item.category}</p>
              <div className="item-footer">
                <span>Added: {item.date}</span>
                <div className="actions">
                  <button className="update-btn" onClick={() => updateStock(item.id, item.quantity)}>Update Stock</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && <p className="empty">No items found</p>}
      </div>

      {lowStockItems.length > 0 && (
        <div className="alert-box">
          <h4>⚠ Low Stock Alert</h4>
          <div className="alert-items">
            {lowStockItems.map((item, index) => (
              <span key={index}>{item.name} ({item.quantity} {item.unit})</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;
