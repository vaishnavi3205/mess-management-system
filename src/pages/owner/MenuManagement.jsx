import React, { useState, useEffect } from "react";
import "./MenuManagement.css";

function MenuManagement() {
  const [menuData, setMenuData] = useState({
    breakfast: { items: [], vegetarian: true },
    lunch: { items: [], vegetarian: true },
    dinner: { items: [], vegetarian: true },
    special: { items: [], vegetarian: false },
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Simulate fetching data (replace with API later)
  useEffect(() => {
    const fetchMenu = async () => {
      // Example API fetch
      // const response = await fetch(`/api/menu?date=${selectedDate}`);
      // const data = await response.json();

      // Placeholder dynamic data
      setMenuData({
        breakfast: { items: ["Idli", "Sambar", "Coconut Chutney", "Tea/Coffee"], vegetarian: true },
        lunch: { items: ["Rice", "Dal", "Paneer Butter Masala", "Roti", "Salad", "Curd"], vegetarian: true },
        dinner: { items: ["Jeera Rice", "Rajma Curry", "Roti", "Papad", "Sweet Dish"], vegetarian: true },
        special: { items: ["Sunday Special: Biryani, Raita, Gulab Jamun"], vegetarian: false },
      });
    };

    fetchMenu();
  }, [selectedDate]);

  const toggleMealType = (meal) => {
    setMenuData((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], vegetarian: !prev[meal].vegetarian },
    }));
  };

  const editMenu = (meal) => {
    const newItems = prompt("Enter menu items separated by comma", menuData[meal].items.join(", "));
    if (newItems !== null) {
      setMenuData((prev) => ({
        ...prev,
        [meal]: { ...prev[meal], items: newItems.split(",").map((item) => item.trim()) },
      }));
    }
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <p>Create and manage daily meal plans</p>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
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
              <button onClick={() => editMenu(meal)}>Edit</button>
            </div>
            <div className="meal-items">
              {data.items.map((item, i) => (
                <div key={i} className="meal-item">{item}</div>
              ))}
            </div>
            <div className="meal-footer">
              <label>
                {data.vegetarian ? "Vegetarian" : "Non-Vegetarian"}
                <input
                  type="checkbox"
                  checked={data.vegetarian}
                  onChange={() => toggleMealType(meal)}
                />
              </label>
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
    </div>
  );
}

export default MenuManagement;