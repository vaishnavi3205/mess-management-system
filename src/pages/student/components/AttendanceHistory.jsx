import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import "./AttendanceHistory.css";

const AttendanceHistory = () => {
  const { user } = useAuth();
  const { attendance } = useMess();
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const myAttendance = attendance.filter(a => a.studentEmail === user.email);

  const filteredAttendance = myAttendance.filter(a => a.date.startsWith(filterMonth));

  const presentBreakfast = filteredAttendance.filter(a => a.meal === "Breakfast").length;
  const presentLunch = filteredAttendance.filter(a => a.meal === "Lunch").length;
  const presentDinner = filteredAttendance.filter(a => a.meal === "Dinner").length;
  const totalPresent = filteredAttendance.length;

  return (
    <div className="attendance-history-container">
      <div className="attendance-history-header">
        <h2>My Attendance History</h2>
        <p>View your mess attendance records</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card total-card">
          <h4>Total Present</h4>
          <h2>{totalPresent}</h2>
        </div>
        <div className="summary-card breakfast-card">
          <h4>Breakfast</h4>
          <h2>{presentBreakfast}</h2>
        </div>
        <div className="summary-card lunch-card">
          <h4>Lunch</h4>
          <h2>{presentLunch}</h2>
        </div>
        <div className="summary-card dinner-card">
          <h4>Dinner</h4>
          <h2>{presentDinner}</h2>
        </div>
      </div>

      <div className="filter-section">
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
      </div>

      <div className="attendance-records">
        {filteredAttendance.length > 0 ? (
          <table className="attendance-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.meal}</td>
                  <td>{record.timestamp}</td>
                  <td>
                    <span className="present-badge">Present</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <span className="empty-emoji">📋</span>
            No attendance records found for this month.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;