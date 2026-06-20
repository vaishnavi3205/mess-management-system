import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaUtensils,
  FaCalendarAlt,
  FaFileAlt,
  FaReceipt,
  FaCommentAlt,
  FaBullhorn,
  FaSignOutAlt,
  FaClipboardCheck
} from "react-icons/fa";
import Profile from "./components/Profile";
import TodaysMenu from "./components/TodaysMenu";
import LeaveApplication from "./components/LeaveApplication";
import Calendar from "./components/Calendar";
import BillsReceipt from "./components/BillsReceipt";
import FeedbackComplaint from "./components/FeedbackComplaint";
import Announcements from "./components/Announcements";
import AttendanceHistory from "./components/AttendanceHistory";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (email) => {
    if (!email) return "??";
    return email.substring(0, 2).toUpperCase();
  };

  const sidebarItems = [
    { name: "Profile", icon: FaUser },
    { name: "Today's Menu", icon: FaUtensils },
    { name: "Leave Application", icon: FaFileAlt },
    { name: "Calendar", icon: FaCalendarAlt },
    { name: "Attendance", icon: FaClipboardCheck },
    { name: "Bills & Receipt", icon: FaReceipt },
    { name: "Feedback & Complaint", icon: FaCommentAlt },
    { name: "Announcements", icon: FaBullhorn }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile />;
      case "Today's Menu":
        return <TodaysMenu />;
      case "Leave Application":
        return <LeaveApplication />;
      case "Calendar":
        return <Calendar />;
      case "Attendance":
        return <AttendanceHistory />;
      case "Bills & Receipt":
        return <BillsReceipt />;
      case "Feedback & Complaint":
        return <FeedbackComplaint />;
      case "Announcements":
        return <Announcements />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="student-dashboard">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <h1>Smart Mess</h1>
        </div>
        <div className="topbar-right">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials(user?.email)}
            </div>
            <span className="user-name">{user?.email || "Guest"}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeTab === item.name ? "active" : ""}`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <IconComponent className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;