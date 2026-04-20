import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaTrash, FaChartLine, FaPlus } from "react-icons/fa";
import "./WasteManagement.css";

const WasteManagement = () => {
  const [dailyData, setDailyData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: "",
    actual: "",
    target: "",
  });

  useEffect(() => {
    const savedDaily = JSON.parse(localStorage.getItem("dailyWaste"));
    const savedMeal = JSON.parse(localStorage.getItem("mealWaste"));
    const savedMonthly = JSON.parse(localStorage.getItem("monthlyWaste"));

    if (savedDaily) setDailyData(savedDaily);
    else {
      const defaultData = [
        { day: "Mon", actual: 12, target: 10 },
        { day: "Tue", actual: 11, target: 10 },
        { day: "Wed", actual: 13, target: 10 },
        { day: "Thu", actual: 10, target: 10 },
        { day: "Fri", actual: 11, target: 10 },
        { day: "Sat", actual: 9, target: 10 },
        { day: "Sun", actual: 8, target: 10 },
      ];
      setDailyData(defaultData);
    }

    if (savedMeal) setMealData(savedMeal);
    else {
      setMealData([
        { meal: "Breakfast", waste: 45 },
        { meal: "Lunch", waste: 120 },
        { meal: "Dinner", waste: 130 },
      ]);
    }

    if (savedMonthly) setMonthlyData(savedMonthly);
    else {
      setMonthlyData([
        { month: "Sep", waste: 380 },
        { month: "Oct", waste: 400 },
        { month: "Nov", waste: 360 },
        { month: "Dec", waste: 340 },
        { month: "Jan", waste: 320 },
        { month: "Feb", waste: 300 },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dailyWaste", JSON.stringify(dailyData));
    localStorage.setItem("mealWaste", JSON.stringify(mealData));
    localStorage.setItem("monthlyWaste", JSON.stringify(monthlyData));
  }, [dailyData, mealData, monthlyData]);

  const totalDailyWaste = dailyData.reduce((sum, d) => sum + d.actual, 0);
  const avgWastePerPlate = (totalDailyWaste / 140).toFixed(3);

  const trend =
    monthlyData.length > 1
      ? (
          ((monthlyData[0].waste -
            monthlyData[monthlyData.length - 1].waste) /
            monthlyData[0].waste) *
          100
        ).toFixed(1)
      : 0;

  const handleAddEntry = () => {
    if (!newEntry.day || !newEntry.actual || !newEntry.target) {
      alert("Please fill all fields");
      return;
    }

    setDailyData([
      ...dailyData,
      {
        day: newEntry.day,
        actual: Number(newEntry.actual),
        target: Number(newEntry.target),
      },
    ]);

    setNewEntry({ day: "", actual: "", target: "" });
    setShowModal(false);
  };

  return (
    <div className="waste-page">
      <div className="header">
        <h2>Waste Management</h2>
        <button onClick={() => setShowModal(true)}>
          <FaPlus /> Add Entry
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="card">
          <FaTrash />
          <h3>{totalDailyWaste.toFixed(1)} kg</h3>
          <p>Daily Waste</p>
        </div>

        <div className="card">
          <FaChartLine />
          <h3>{avgWastePerPlate} kg</h3>
          <p>Avg Waste Per Plate</p>
        </div>

        <div className="card">
          <FaChartLine />
          <h3>{trend}%</h3>
          <p>Waste Trend</p>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="chart-box">
        <h3>Daily Waste Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" fill="#f59e0b" />
            <Bar dataKey="target" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly + Meal */}
      <div className="grid">
        <div className="chart-box">
          <h3>Monthly Waste Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="waste" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Waste by Meal Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={mealData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="meal" type="category" />
              <Tooltip />
              <Bar dataKey="waste" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Waste Reduction Recommendations</h3>
        <ul>
          <li>Monitor portion sizes carefully.</li>
          <li>Encourage students to take small servings.</li>
          <li>Reuse leftovers responsibly.</li>
          <li>Track daily waste consistently.</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Waste Entry</h3>
            <input
              placeholder="Day (e.g. Mon)"
              value={newEntry.day}
              onChange={(e) =>
                setNewEntry({ ...newEntry, day: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Actual Waste"
              value={newEntry.actual}
              onChange={(e) =>
                setNewEntry({ ...newEntry, actual: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Target Waste"
              value={newEntry.target}
              onChange={(e) =>
                setNewEntry({ ...newEntry, target: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleAddEntry}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteManagement;