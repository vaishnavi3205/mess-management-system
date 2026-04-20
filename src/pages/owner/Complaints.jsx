import React, { useState, useMemo } from "react";
import "./Complaints.css";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    student: "",
    rating: 0,
  });

  // ===== ADD COMPLAINT =====
  const handleAddComplaint = (e) => {
    e.preventDefault();

    if (
      !newComplaint.title.trim() ||
      !newComplaint.description.trim() ||
      !newComplaint.student.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const complaint = {
      id: Date.now(),
      ...newComplaint,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };

    setComplaints((prev) => [complaint, ...prev]);

    setNewComplaint({
      title: "",
      description: "",
      student: "",
      rating: 0,
    });
  };

  // ===== MARK RESOLVED =====
  const markResolved = (id) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Resolved" } : c
      )
    );
  };

  // ===== DELETE =====
  const deleteComplaint = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  // ===== FILTER =====
  const filteredComplaints = useMemo(() => {
    if (filter === "All") return complaints;
    return complaints.filter((c) => c.status === filter);
  }, [complaints, filter]);

  // ===== SUMMARY DATA =====
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const averageRating =
    complaints.length > 0
      ? (
          complaints.reduce((acc, c) => acc + c.rating, 0) /
          complaints.length
        ).toFixed(1)
      : 0;

  return (
    <div className="complaints-container">
      <h1>Complaints & Feedback</h1>
      <p className="subtitle">
        Manage student complaints and improve service quality
      </p>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-grid">
        <div className="card">
          <h4>Total Complaints</h4>
          <h2>{total}</h2>
        </div>

        <div className="card pending-card">
          <h4>Pending</h4>
          <h2>{pending}</h2>
        </div>

        <div className="card rating-card">
          <h4>Average Rating</h4>
          <h2>{averageRating}</h2>
        </div>
      </div>

      {/* ===== ADD FORM ===== */}
      <form className="complaint-form" onSubmit={handleAddComplaint}>
        <input
          type="text"
          placeholder="Complaint Title"
          value={newComplaint.title}
          onChange={(e) =>
            setNewComplaint({ ...newComplaint, title: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Student Name"
          value={newComplaint.student}
          onChange={(e) =>
            setNewComplaint({ ...newComplaint, student: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={newComplaint.description}
          onChange={(e) =>
            setNewComplaint({
              ...newComplaint,
              description: e.target.value,
            })
          }
        />

        <div className="rating-input">
          <span>Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= newComplaint.rating
                  ? "star selected"
                  : "star"
              }
              onClick={() =>
                setNewComplaint({ ...newComplaint, rating: star })
              }
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit">Add Complaint</button>
      </form>

      {/* ===== FILTER ===== */}
      <div className="filter-tabs">
        {["All", "Pending", "Resolved"].map((tab) => (
          <button
            key={tab}
            className={filter === tab ? "active" : ""}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===== COMPLAINT LIST ===== */}
      <div className="complaint-list">
        {filteredComplaints.map((c) => (
          <div
            key={c.id}
            className={`complaint-card ${
              c.status === "Resolved" ? "resolved" : "pending"
            }`}
          >
            <div className="complaint-header">
              <h3>{c.title}</h3>
              <span
                className={
                  c.status === "Resolved"
                    ? "badge resolved-badge"
                    : "badge pending-badge"
                }
              >
                {c.status}
              </span>
            </div>

            <p>{c.description}</p>

            <div className="complaint-footer">
              <span>
                Student: {c.student} | {c.date}
              </span>

              <div className="stars">
                {[...Array(c.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              <div className="actions">
                {c.status === "Pending" && (
                  <button
                    className="resolve-btn"
                    onClick={() => markResolved(c.id)}
                  >
                    Mark Resolved
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteComplaint(c.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredComplaints.length === 0 && (
          <p className="empty">No complaints found</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;