import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./OwnerDashboard.css";

import {
  FaUsers,
  FaUserCheck,
  FaUtensils,
  FaRupeeSign,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isDashboard = location.pathname === "/owner";

  const [data, setData] = useState({
    students: 0,
    activeStudents: 0,
    plates: 0,
    revenue: 0,
    complaints: 0,
    lowStock: 0,
    revenueChart: [],
    plateChart: [],
    wasteChart: [],
  });

  // 🔥 KEEP YOUR ORIGINAL LOGIC
  useEffect(() => {
  fetch("http://localhost:5000/api/dashboard")
    .then((res) => res.json())
    .then((res) => {
      setData(res);
    })
    .catch((err) => {
      console.log("Fetch Error:", err);
    });
}, []);




  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };

  // UI only (no logic impact)
  const getTrend = () => {
    return { text: "this week", type: "neutral" };
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Smart Mess</h2>

        <nav>
          <Link to="">Owner Dashboard</Link>
          <Link to="students">Student Management</Link>
          <Link to="menu">Menu Management</Link>
          <Link to="inventory">Inventory</Link>
          <Link to="billing">Billing</Link>
          <Link to="waste">Waste Management</Link>
          <Link to="complaints">Complaints</Link>
          <Link to="announcements">Announcements</Link>
          <Link to="staff">Staff</Link>
        </nav>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <input type="text" placeholder="Search..." />
          <div className="admin">Admin</div>
        </div>

        <div className="content">
          {isDashboard ? (
            <>
              <h2>Dashboard Overview</h2>
              <p className="subtitle">
                Welcome back! Here's what's happening with your mess today.
              </p>

              {/* Cards */}
              <div className="cards">
                <Card title="Total Registered Students" value={data.students} icon={<FaUsers />} />
                <Card title="Active Students" value={data.activeStudents} icon={<FaUserCheck />} />
                <Card title="Daily Plate Count" value={data.plates} icon={<FaUtensils />} />
                <Card title="Monthly Revenue" value={`₹${data.revenue}`} icon={<FaRupeeSign />} />
                <Card title="Pending Complaints" value={data.complaints} icon={<FaClipboardList />} />
                <Card title="Low Stock Alerts" value={data.lowStock} icon={<FaExclamationTriangle />} alert />
              </div>

              {/* Charts */}
              <div className="charts">

                <div className="chart-box">
                  <h3>Monthly Revenue</h3>
                  <p className="chart-sub">Revenue trend over the last 6 months</p>

                  <Line
                    data={{
                      labels: data.revenueChart?.map((d) => d.month) || [],
                      datasets: [
                        {
                          label: "Revenue",
                          data: data.revenueChart?.map((d) => d.value) || [],
                          borderWidth: 2,
                        },
                      ],
                    }}
                  />
                </div>

                <div className="chart-box">
                  <h3>Plate Consumption</h3>
                  <p className="chart-sub">Daily meal distribution this week</p>

                  <Bar
                    data={{
                      labels: data.plateChart?.map((d) => d.day) || [],
                      datasets: [
                        {
                          label: "Breakfast",
                          data: data.plateChart?.map((d) => d.breakfast) || [],
                        },
                        {
                          label: "Lunch",
                          data: data.plateChart?.map((d) => d.lunch) || [],
                        },
                        {
                          label: "Dinner",
                          data: data.plateChart?.map((d) => d.dinner) || [],
                        },
                      ],
                    }}
                  />
                </div>

              </div>

              {/* Waste */}
              <div className="chart-box full">
                <h3>Waste Per Plate Analysis</h3>
                <p className="chart-sub">Average food waste per plate (in kg) this week</p>

                <Bar
                  data={{
                    labels: data.wasteChart?.map((d) => d.day) || [],
                    datasets: [
                      {
                        label: "Waste",
                        data: data.wasteChart?.map((d) => d.value) || [],
                      },
                    ],
                  }}
                />
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

function Card({ title, value, icon, alert }) {
  return (
    <div className={`card ${alert ? "alert" : ""}`}>
      <div className="card-header">
        <span>{title}</span>
        <div className="icon">{icon}</div>
      </div>

      <h2>{value || "--"}</h2>
      <p className="trend">this week</p>
    </div>
  );
}

export default OwnerDashboard;