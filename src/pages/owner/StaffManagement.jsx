import React, { useState } from "react";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Ramesh Patil",
      role: "Cook",
      phone: "9876543210",
      joiningDate: "2024-01-10",
      status: "Active",
    },
    {
      id: 2,
      name: "Suresh More",
      role: "Helper",
      phone: "9123456780",
      joiningDate: "2024-02-05",
      status: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewStaff, setViewStaff] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
    joiningDate: "",
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.phone || !newStaff.joiningDate) {
      alert("Please fill all fields!");
      return;
    }

    const staff = {
      id: Date.now(),
      ...newStaff,
      status: "Pending",
    };

    setStaffList([...staffList, staff]);
    setNewStaff({ name: "", role: "", phone: "", joiningDate: "" });
    setShowModal(false);
  };

  const handleRemove = (id) => {
    setStaffList(staffList.filter((s) => s.id !== id));
  };

  const handleApprove = (id) => {
    setStaffList(
      staffList.map((s) =>
        s.id === id ? { ...s, status: "Active" } : s
      )
    );
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : staff.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="staff-container">
      <div className="header">
        <div>
          <h2>Staff Management</h2>
          <p>Manage mess staff details and status</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Staff
        </button>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Staff</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Joining Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.role}</td>
              <td>{staff.phone}</td>
              <td>{staff.joiningDate}</td>
              <td>
                <span className={`status ${staff.status.toLowerCase()}`}>
                  {staff.status}
                </span>
              </td>
              <td>
                {staff.status === "Pending" && (
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(staff.id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="view-btn"
                  onClick={() => setViewStaff(staff)}
                >
                  View
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(staff.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="count">
        Showing {filteredStaff.length} of {staffList.length} staff members
      </p>

      {/* Add Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Staff</h3>
            <input
              type="text"
              placeholder="Staff Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Role"
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={newStaff.phone}
              onChange={(e) =>
                setNewStaff({ ...newStaff, phone: e.target.value })
              }
            />
            <input
              type="date"
              value={newStaff.joiningDate}
              onChange={(e) =>
                setNewStaff({ ...newStaff, joiningDate: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={handleAddStaff}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewStaff && (
        <div className="modal">
          <div className="modal-content">
            <h3>Staff Details</h3>
            <p><strong>Name:</strong> {viewStaff.name}</p>
            <p><strong>Role:</strong> {viewStaff.role}</p>
            <p><strong>Phone:</strong> {viewStaff.phone}</p>
            <p><strong>Joining Date:</strong> {viewStaff.joiningDate}</p>
            <p><strong>Status:</strong> {viewStaff.status}</p>
            <button onClick={() => setViewStaff(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;