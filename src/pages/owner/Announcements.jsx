import React, { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

import "./Announcements.css";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audience: "All Students",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("announcements"));
    if (saved) {
      setAnnouncements(saved);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill all fields!");
      return;
    }

    if (editingId) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingId ? { ...a, ...formData } : a
        )
      );
      setEditingId(null);
    } else {
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        date: new Date().toLocaleString(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setFormData({ title: "", description: "", audience: "All Students" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (announcement) => {
    setFormData(announcement);
    setEditingId(announcement.id);
    setShowModal(true);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    return (
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const thisMonth = announcements.filter(
    (a) => new Date(a.date).getMonth() === new Date().getMonth()
  );

  return (
    <div className="announcement-page">
      {/* Header */}
      <div className="top-bar">
        <h2>Announcements</h2>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Create Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <FaBullhorn />
          <h3>{announcements.length}</h3>
          <p>Total Announcements</p>
        </div>

        <div className="stat-card">
          <FaCalendarAlt />
          <h3>{thisMonth.length}</h3>
          <p>This Month</p>
        </div>

        <div className="stat-card">
          <FaUsers />
          <h3>{announcements.length * 100}</h3>
          <p>Reach</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="announcement-list">
        {filteredAnnouncements.length === 0 ? (
          <p className="no-data">No announcements found.</p>
        ) : (
          filteredAnnouncements.map((a) => (
            <div key={a.id} className="announcement-card">
              <div className="card-left">
                <FaBullhorn className="icon" />
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.description}</p>
                  <span className="audience">{a.audience}</span>
                </div>
              </div>

              <div className="card-right">
                <small>{a.date}</small>
                <div className="actions">
                  <FaEdit onClick={() => handleEdit(a)} />
                  <FaTrash onClick={() => handleDelete(a.id)} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Edit Announcement" : "Create Announcement"}</h3>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <select
              name="audience"
              value={formData.audience}
              onChange={handleChange}
            >
              <option>All Students</option>
              <option>Hostel Students</option>
              <option>Staff</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {editingId ? "Update" : "Create"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;