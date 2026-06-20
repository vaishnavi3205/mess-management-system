import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import { FaTimes } from "react-icons/fa";
import "./Calendar.css";

const Calendar = () => {
  const { user } = useAuth();
  const { announcements } = useMess();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    // Load leave applications
    const savedLeaves = localStorage.getItem("mess_leaves");
    if (savedLeaves) {
      const allLeaves = JSON.parse(savedLeaves);
      const studentLeaves = allLeaves.filter(leave => leave.studentEmail === user.email);
      setLeaveApplications(studentLeaves);
    }
  }, [user.email]);

  const handleCalendarDayClick = (date) => {
    const dayAnnouncements = announcements.filter(ann => {
      const annDate = new Date(ann.date);
      return annDate.toDateString() === date.toDateString();
    });
    
    if (dayAnnouncements.length > 0) {
      setSelectedAnnouncement(dayAnnouncements[0]);
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const hasLeave = leaveApplications.some(leave => {
        const leaveStart = new Date(leave.fromDate);
        const leaveEnd = new Date(leave.toDate);
        return date >= leaveStart && date <= leaveEnd;
      });
      const hasAnnouncement = announcements.some(ann => {
        const annDate = new Date(ann.date);
        return annDate.toDateString() === date.toDateString();
      });
      
      days.push(
        <div
          key={i}
          className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${hasAnnouncement ? 'has-announcement' : ''}`}
          onClick={() => handleCalendarDayClick(date)}
        >
          <span className="day-number">{date.getDate()}</span>
          <div className="day-indicators">
            {hasLeave && <div className="leave-indicator"></div>}
            {hasAnnouncement && <div className="announcement-indicator"></div>}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="tab-content">
      <h2>Calendar</h2>
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="nav-btn"
          >
            ‹
          </button>
          <h3>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="nav-btn"
          >
            ›
          </button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {renderCalendar()}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot today-dot"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot leave-dot"></div>
            <span>Leave Applied</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot announcement-dot"></div>
            <span>Announcement</span>
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>📢 Announcement</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedAnnouncement(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="announcement-content">
              <h4>{selectedAnnouncement.title}</h4>
              <p>{selectedAnnouncement.description}</p>
              <div className="announcement-meta">
                <span className="audience-badge">{selectedAnnouncement.audience}</span>
                <span className="announcement-date">{selectedAnnouncement.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;