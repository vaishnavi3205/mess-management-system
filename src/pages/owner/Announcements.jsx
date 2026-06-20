import { useState } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import { useMess } from "../../context/MessContext";
import "./Announcements.css";

const Announcements = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useMess();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState({ title: "", description: "", audience: "All Students" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill all fields");
      return;
    }
    await addAnnouncement({ ...formData, date: new Date().toISOString() });
    setFormData({ title: "", description: "", audience: "All Students" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteAnnouncement(id);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : a.audience === filter;
    return matchesSearch && matchesFilter;
  });

  const totalAnnouncements = announcements.length;
  const thisMonth = announcements.filter(
    (a) => new Date(a.date).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="announcement-page">
      <h2>Announcements</h2>
      <p className="subtitle">Create and manage announcements for students and staff</p>

      <div className="summary-grid">
        <div className="card"><h4>Total Announcements</h4><h2>{totalAnnouncements}</h2></div>
        <div className="card month-card"><h4>This Month</h4><h2>{thisMonth}</h2></div>
      </div>

      <form className="announcement-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Announcement Title"
          value={formData.title} onChange={handleChange} />
        <textarea name="description" placeholder="Announcement Description"
          value={formData.description} onChange={handleChange} rows="3" />
        <select name="audience" value={formData.audience} onChange={handleChange}>
          <option value="All Students">All Students</option>
          <option value="Hostel Students">Hostel Students</option>
          <option value="Staff">Staff</option>
        </select>
        <button type="submit">Create Announcement</button>
      </form>

      <div className="filter-tabs">
        {["All", "All Students", "Hostel Students", "Staff"].map((tab) => (
          <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>
        ))}
      </div>

      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search announcements..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="announcement-list">
        {filteredAnnouncements.map((a) => (
          <div key={a.id} className="announcement-card">
            <div className="announcement-header">
              <h3>{a.title}</h3>
              <span className="badge audience-badge">{a.audience}</span>
            </div>
            <p>{a.description}</p>
            <div className="announcement-footer">
              <span>Created: {new Date(a.date).toLocaleDateString()}</span>
              <div className="actions">
                <button className="delete-btn" onClick={() => handleDelete(a.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredAnnouncements.length === 0 && <p className="empty">No announcements found</p>}
      </div>
    </div>
  );
};

export default Announcements;
