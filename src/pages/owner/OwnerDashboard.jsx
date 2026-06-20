import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMess } from "../../context/MessContext";
import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./OwnerDashboard.css";

import {
  FaUsers,
  FaUserCheck,
  FaUtensils,
  FaRupeeSign,
  FaClipboardList,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaBoxes,
  FaTrash,
  FaBullhorn,
  FaUserTie,
  FaBell,
  FaSearch,
  FaCog,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus,
  FaDownload,
  FaFilter,
  FaStar,
  FaChartLine,
  FaMoneyBillWave,
  FaUserClock,
  FaUtensils as FaPlate,
  FaCalendarCheck,
} from "react-icons/fa";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { students, complaints, inventory, bills } = useMess();

  const isDashboard = location.pathname === "/dashboard";
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "warning", message: "Rice stock running low", time: "2 mins ago" },
    { id: 2, type: "info", message: "New student registration pending", time: "5 mins ago" },
    { id: 3, type: "success", message: "Monthly revenue target achieved", time: "1 hour ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Static chart data (kept as requested)
  const revenueChart = [
    { month: "Jan", value: 20000 },
    { month: "Feb", value: 22000 },
    { month: "Mar", value: 25000 },
    { month: "Apr", value: 23000 },
    { month: "May", value: 27000 },
    { month: "Jun", value: 32000 },
  ];

  const plateChart = [
    { day: "Mon", breakfast: 40, lunch: 60, dinner: 55 },
    { day: "Tue", breakfast: 42, lunch: 62, dinner: 58 },
    { day: "Wed", breakfast: 38, lunch: 58, dinner: 54 },
    { day: "Thu", breakfast: 45, lunch: 65, dinner: 60 },
    { day: "Fri", breakfast: 50, lunch: 70, dinner: 64 },
    { day: "Sat", breakfast: 55, lunch: 72, dinner: 68 },
  ];

  const wasteChart = [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 2.8 },
    { day: "Wed", value: 3.2 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 2.5 },
    { day: "Sat", value: 2.9 },
  ];

  const mealDistribution = {
    breakfast: 25,
    lunch: 45,
    dinner: 30
  };

  const recentActivities = [
    { id: 1, action: "New student registered", user: "John Doe", time: "10 mins ago" },
    { id: 2, action: "Complaint resolved", user: "Admin", time: "25 mins ago" },
    { id: 3, action: "Inventory updated", user: "Staff", time: "1 hour ago" },
    { id: 4, action: "Menu published", user: "Chef", time: "2 hours ago" },
  ];

  const todayMenu = {
    breakfast: ["Poha", "Tea", "Banana"],
    lunch: ["Rice", "Dal", "Sabzi", "Roti"],
    dinner: ["Rice", "Rajma", "Salad", "Roti"]
  };

  // Computed values from real data
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "Active").length;
  const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
  const lowStockItems = inventory.filter(i => i.quantity < 50);
  const monthlyRevenue = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getTrend = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      text: `${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'increase' : 'decrease'}`,
      type: change >= 0 ? 'up' : 'down',
      value: change
    };
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addStudent':
        navigate('/dashboard/students');
        break;
      case 'updateMenu':
        navigate('/dashboard/menu');
        break;
      case 'viewComplaints':
        navigate('/dashboard/complaints');
        break;
      case 'checkInventory':
        navigate('/dashboard/inventory');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Smart Mess</h2>

        <nav>
          <NavLink to="" end><FaTachometerAlt />Dashboard</NavLink>
          <NavLink to="students"><FaUsers />Students</NavLink>
          <NavLink to="menu"><FaUtensils />Menu</NavLink>
          <NavLink to="inventory"><FaBoxes />Inventory</NavLink>
          <NavLink to="billing"><FaRupeeSign />Billing</NavLink>
          <NavLink to="attendance"><FaUserCheck />Attendance</NavLink>
          <NavLink to="waste"><FaTrash />Waste</NavLink>
          <NavLink to="complaints"><FaClipboardList />Complaints</NavLink>
          <NavLink to="announcements"><FaBullhorn />Announcements</NavLink>
          <NavLink to="staff"><FaUserTie />Staff</NavLink>
          <NavLink to="leave-requests"><FaCalendarCheck />Leave Requests</NavLink>
        </nav>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <h3>Smart Mess Dashboard</h3>
          </div>
          
          <div className="topbar-actions">
            <div className="notification-container">
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setNotifications([])}>Clear All</button>
                  </div>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                      <p>{notif.message}</p>
                      <span>{notif.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="admin">
              <FaCog className="settings-icon" />
              Admin Panel
            </div>
          </div>
        </div>

        <div className="content">
          {isDashboard ? (
            <>
              <div className="dashboard-header">
                <div className="header-left">
                  <h2>Dashboard Overview</h2>
                  <p className="subtitle">
                    Welcome back! Here's what's happening with your mess today.
                  </p>
                </div>
                <div className="header-actions">
                  <button className="action-btn primary" onClick={() => handleQuickAction('addStudent')}>
                    <FaPlus /> Add Student
                  </button>
                  <button className="action-btn secondary" onClick={() => handleQuickAction('updateMenu')}>
                    <FaUtensils /> Update Menu
                  </button>
                  <button className="action-btn" onClick={() => window.print()}>
                    <FaDownload /> Export Report
                  </button>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="cards">
                <EnhancedCard 
                  title="Total Students" 
                  value={totalStudents} 
                  icon={<FaUsers />} 
                  trend={getTrend(totalStudents, 112)}
                  subtitle={`${activeStudents} active students`}
                />
                <EnhancedCard 
                  title="Active Students" 
                  value={activeStudents} 
                  icon={<FaPlate />} 
                  trend={getTrend(activeStudents, 85)}
                  subtitle="Currently enrolled"
                />
                <EnhancedCard 
                  title="Monthly Revenue" 
                  value={`₹${monthlyRevenue.toLocaleString()}`} 
                  icon={<FaMoneyBillWave />} 
                  trend={getTrend(monthlyRevenue, 140000)}
                  subtitle="Paid bills total"
                />
                <EnhancedCard 
                  title="Pending Complaints" 
                  value={pendingComplaints} 
                  icon={<FaClipboardList />} 
                  trend={{ text: "Needs attention", type: "neutral" }}
                  subtitle="Awaiting resolution"
                />
                <EnhancedCard 
                  title="Low Stock Items" 
                  value={lowStockItems.length} 
                  icon={<FaExclamationTriangle />} 
                  alert={lowStockItems.length > 0}
                  trend={{ text: "Needs restocking", type: "down" }}
                  subtitle="Inventory alerts"
                />
                <EnhancedCard 
                  title="Total Inventory" 
                  value={inventory.length} 
                  icon={<FaBoxes />} 
                  trend={getTrend(inventory.length, 42)}
                  subtitle="Items in stock"
                />
              </div>

              {/* Quick Actions & Today's Menu */}
              <div className="dashboard-widgets">
                <div className="widget quick-actions">
                  <h3><FaClock /> Quick Actions</h3>
                  <div className="action-grid">
                    <button onClick={() => handleQuickAction('viewComplaints')} className="quick-action-btn">
                      <FaClipboardList />
                      <span>View Complaints</span>
                      <small>{pendingComplaints} pending</small>
                    </button>
                    <button onClick={() => handleQuickAction('checkInventory')} className="quick-action-btn">
                      <FaBoxes />
                      <span>Check Inventory</span>
                      <small>{lowStockItems.length} low stock</small>
                    </button>
                    <button onClick={() => navigate('/dashboard/announcements')} className="quick-action-btn">
                      <FaBullhorn />
                      <span>Send Announcement</span>
                      <small>Notify students</small>
                    </button>
                    <button onClick={() => navigate('/dashboard/billing')} className="quick-action-btn">
                      <FaRupeeSign />
                      <span>Billing Report</span>
                      <small>Monthly summary</small>
                    </button>
                  </div>
                </div>

                <div className="widget todays-menu">
                  <h3><FaUtensils /> Today's Menu</h3>
                  <div className="menu-sections">
                    <div className="menu-section">
                      <h4>Breakfast</h4>
                      <ul>
                        {todayMenu.breakfast.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="menu-section">
                      <h4>Lunch</h4>
                      <ul>
                        {todayMenu.lunch.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="menu-section">
                      <h4>Dinner</h4>
                      <ul>
                        {todayMenu.dinner.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts">
                <div className="chart-box">
                  <div className="chart-header">
                    <h3>Monthly Revenue Trend</h3>
                    <p className="chart-sub">Revenue performance over last 6 months</p>
                  </div>
                  <Line
                    data={{
                      labels: revenueChart?.map((d) => d.month) || [],
                      datasets: [
                        {
                          label: "Revenue (₹)",
                          data: revenueChart?.map((d) => d.value) || [],
                          borderColor: "#6366f1",
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                          borderWidth: 3,
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "#f1f5f9" }
                        },
                        x: {
                          grid: { display: false }
                        }
                      }
                    }}
                  />
                </div>

                <div className="chart-box">
                  <div className="chart-header">
                    <h3>Meal Distribution</h3>
                    <p className="chart-sub">Today's meal preference breakdown</p>
                  </div>
                  <Doughnut
                    data={{
                      labels: ["Breakfast", "Lunch", "Dinner"],
                      datasets: [
                        {
                          data: [mealDistribution.breakfast, mealDistribution.lunch, mealDistribution.dinner],
                          backgroundColor: ["#f59e0b", "#10b981", "#6366f1"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { padding: 20 }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="dashboard-bottom">
                <div className="widget recent-activities">
                  <div className="widget-header">
                    <h3><FaChartLine /> Recent Activities</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="activities-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-content">
                          <p><strong>{activity.action}</strong></p>
                          <small>by {activity.user} • {activity.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="widget inventory-alerts">
                  <div className="widget-header">
                    <h3><FaExclamationTriangle /> Inventory Alerts</h3>
                    <button onClick={() => navigate('/dashboard/inventory')} className="view-all-btn">
                      Manage Stock
                    </button>
                  </div>
                  <div className="alerts-list">
                    {lowStockItems.map((item, idx) => (
                      <div key={idx} className="alert-item">
                        <div className="alert-content">
                          <h4>{item.name}</h4>
                          <p>Current: {item.quantity} / Min: 50</p>
                          <div className="stock-bar">
                            <div 
                              className="stock-fill" 
                              style={{ width: `${(item.quantity / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <button className="restock-btn">Restock</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="widget plate-analysis">
                  <h3><FaTrash /> Weekly Waste Analysis</h3>
                  <p className="chart-sub">Food waste per plate (kg) - This week</p>
                  <Bar
                    data={{
                      labels: wasteChart?.map((d) => d.day) || [],
                      datasets: [
                        {
                          label: "Waste (kg)",
                          data: wasteChart?.map((d) => d.value) || [],
                          backgroundColor: "#ef4444",
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "#f1f5f9" }
                        },
                        x: {
                          grid: { display: false }
                        }
                      }
                    }}
                  />
                </div>
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

function EnhancedCard({ title, value, icon, alert, trend, subtitle, realTime }) {
  return (
    <div className={`card enhanced-card ${alert ? "alert" : ""} ${realTime ? "real-time" : ""}`}>
      <div className="card-header">
        <span>{title}</span>
        <div className="icon">{icon}</div>
      </div>

      <div className="card-content">
        <h2>{value || "--"}</h2>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`trend ${trend.type}`}>
            {trend.type === 'up' && <FaArrowUp />}
            {trend.type === 'down' && <FaArrowDown />}
            <span>{trend.text}</span>
          </div>
        )}
      </div>
      
      {realTime && <div className="real-time-indicator">●</div>}
    </div>
  );
}

export default OwnerDashboard;