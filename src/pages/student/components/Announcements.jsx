import React from "react";
import { useMess } from "../../../context/MessContext";
import "./Announcements.css";

const Announcements = () => {
  const { announcements } = useMess();

  return (
    <div className="tab-content">
      <h2>Announcements</h2>
      {announcements.length > 0 ? (
        <div className="announcements-list">
          {announcements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(announcement => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-header">
                  <h3>{announcement.title}</h3>
                  <span className="audience-badge">{announcement.audience}</span>
                </div>
                <p>{announcement.description}</p>
                <span className="announcement-date">{announcement.date}</span>
              </div>
            ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">📢</span>
          <h3>No Announcements</h3>
          <p>No announcements yet.</p>
        </div>
      )}
    </div>
  );
};

export default Announcements;