import React, { useState } from "react";
import { useMess } from "../../context/MessContext";
import "./StaffManagement.css";

const StaffManagement = () => {
  const { staff: staffList, addStaff, updateStaff, deleteStaff } = useMess();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [newStaff, setNewStaff] = useState({ name: "", role: "", phone: "", joiningDate: "" });

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.role.trim() || !newStaff.phone.trim() || !newStaff.joiningDate) {
      alert("Please fill all fields");
      return;
    }
    await addStaff({ ...newStaff, status: "Pending", date: new Date().toLocaleDateString() });
    setNewStaff({ name: "", role: "", phone: "", joiningDate: "" });
  };

  const handleApprove = async (id) => {
    await updateStaff(id, { status: "Active" });
  };

  const handleRemove = async (id) => {
    await deleteStaff(id);
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : staff.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "Active").length;
  const pendingStaff = staffList.filter((s) => s.status === "Pending").length;

  return (
    <div className="staff-container">
      <h2>Staff Management</h2>
      <p className="subtitle">Manage mess staff details and status</p>

      <div className="summary-grid">
        <div className="card"><h4>Total Staff</h4><h2>{totalStaff}</h2></div>
        <div className="card active-card"><h4>Active Staff</h4><h2>{activeStaff}</h2></div>
        <div className="card pending-card"><h4>Pending Staff</h4><h2>{pendingStaff}</h2></div>
      </div>

      <form className="staff-form" onSubmit={handleAddStaff}>
        <input type="text" placeholder="Staff Name" value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
        <input type="text" placeholder="Role (Cook, Helper, etc.)" value={newStaff.role}
          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} />
        <input type="tel" placeholder="Phone Number" value={newStaff.phone}
          onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
        <input type="date" value={newStaff.joiningDate}
          onChange={(e) => setNewStaff({ ...newStaff, joiningDate: e.target.value })} />
        <button type="submit">Add Staff</button>
      </form>

      <div className="filter-tabs">
        {["All", "Active", "Pending"].map((tab) => (
          <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>
        ))}
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search by name or role..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="staff-list">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className={`staff-card ${staff.status.toLowerCase()}`}>
            <div className="staff-header">
              <h3>{staff.name}</h3>
              <span className={staff.status === "Active" ? "badge active-badge" : "badge pending-badge"}>
                {staff.status}
              </span>
            </div>
            <p>Role: {staff.role}</p>
            <p>Phone: {staff.phone}</p>
            <p>Joining Date: {staff.joiningDate}</p>
            <div className="staff-footer">
              <span>Added: {staff.date || "N/A"}</span>
              <div className="actions">
                {staff.status === "Pending" && (
                  <button className="approve-btn" onClick={() => handleApprove(staff.id)}>Approve</button>
                )}
                <button className="delete-btn" onClick={() => handleRemove(staff.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
        {filteredStaff.length === 0 && <p className="empty">No staff found</p>}
      </div>

      <p className="count">Showing {filteredStaff.length} of {staffList.length} staff members</p>
    </div>
  );
};

export default StaffManagement;
