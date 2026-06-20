import { useState } from "react";
import { useMess } from "../../context/MessContext";
import "./MenuManagement.css";

function MenuManagement() {
  const { menu: menuData, saveMenu } = useMess();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [editingMeal, setEditingMeal] = useState(null);
  const [editItemsText, setEditItemsText] = useState("");

  const openEditModal = (meal) => {
    setEditingMeal(meal);
    setEditItemsText(menuData[meal].items.join(", "));
  };

  const saveEdit = async () => {
    const updatedItems = editItemsText.split(",").map((i) => i.trim()).filter(Boolean);
    const updatedMenu = { ...menuData, [editingMeal]: { items: updatedItems, vegetarian: menuData[editingMeal].vegetarian } };
    await saveMenu(updatedMenu);
    setEditingMeal(null);
    setEditItemsText("");
  };


  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <p>Create and manage daily meal plans</p>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="menu-tabs">
        {["All Meals", "Breakfast", "Lunch", "Dinner", "Special"].map((tab) => (
          <button key={tab} className="menu-tab">{tab}</button>
        ))}
      </div>

      <div className="menu-grid">
        {Object.entries(menuData).map(([meal, data]) => (
          <div key={meal} className="meal-card">
            <div className="meal-header">
              <h2>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h2>
              <button onClick={() => openEditModal(meal)}>Edit</button>
            </div>
            <div className="meal-items">
              {data.items.length > 0 ? (
                data.items.map((item, i) => (
                  <div key={i} className="meal-item">{item}</div>
                ))
              ) : (
                <div style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic" }}>No items added yet</div>
              )}
            </div>

          </div>
        ))}
      </div>

      <div className="menu-tips">
        <h3>Menu Planning Tips</h3>
        <ul>
          <li>Plan menus a week in advance for better inventory management</li>
          <li>Ensure balanced nutrition with variety in daily meals</li>
          <li>Consider seasonal vegetables for cost optimization</li>
          <li>Mark special occasions and festival menus in advance</li>
        </ul>
      </div>

      {editingMeal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 440, maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginBottom: 16 }}>Edit {editingMeal.charAt(0).toUpperCase() + editingMeal.slice(1)}</h3>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Items (comma separated)</label>
            <textarea rows={4} value={editItemsText} onChange={(e) => setEditItemsText(e.target.value)}
              placeholder="e.g. Rice, Dal, Roti, Curd"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 6, marginBottom: 14, resize: "vertical", fontFamily: "inherit" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveEdit}
                style={{ flex: 1, padding: "10px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Save
              </button>
              <button onClick={() => setEditingMeal(null)}
                style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
