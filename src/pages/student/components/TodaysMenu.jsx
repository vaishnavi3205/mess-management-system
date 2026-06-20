import { useMess } from "../../../context/MessContext";
import "./TodaysMenu.css";

const TodaysMenu = () => {
  const { menu: menuData } = useMess();

  return (
    <div className="tab-content">
      <div className="menu-header">
        <h2>Today's Menu</h2>
        <div className="menu-header-actions">
          <div className="date-display">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>
      </div>

      {menuData ? (
        <div className="menu-grid">
          {[
            { key: "breakfast", emoji: "🌅", label: "Breakfast" },
            { key: "lunch", emoji: "☀️", label: "Lunch" },
            { key: "dinner", emoji: "🌙", label: "Dinner" },
            { key: "special", emoji: "⭐", label: "Special Menu" },
          ].map(({ key, emoji, label }) => {
            const meal = menuData[key];
            if (!meal || meal.items.length === 0) return null;
            return (
              <div key={key} className={`meal-card ${key === "special" ? "special" : ""}`}>
                <div className="meal-header">
                  <span className="meal-emoji">{emoji}</span>
                  <h3>{label}</h3>
                </div>
                <div className="meal-items">
                  {meal.items.map((item, index) => (
                    <span key={index} className="meal-item">{item}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">🍽️</span>
          <h3>Menu Not Available</h3>
          <p>Menu not updated yet by the owner.</p>
        </div>
      )}
    </div>
  );
};

export default TodaysMenu;
