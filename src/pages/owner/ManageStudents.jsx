import React, { useState, useMemo } from "react";
import "./ManageStudent.css";

function ManageStudent() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    regNo: "",
    joiningDate: "",
    leaveDate: "",
    status: "Pending"
  });

  // 🔎 Filter + Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.regNo.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ? true : student.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  // ➕ Add Student
  const addStudent = () => {
    if (!newStudent.name || !newStudent.regNo || !newStudent.joiningDate)
      return alert("Please fill required fields");

    setStudents([...students, newStudent]);
    setNewStudent({
      name: "",
      regNo: "",
      joiningDate: "",
      leaveDate: "",
      status: "Pending"
    });
    setShowForm(false);
  };

  // ❌ Remove Student
  const removeStudent = (regNo) => {
    setStudents(students.filter((s) => s.regNo !== regNo));
  };

  // ✅ Approve Student
  const approveStudent = (regNo) => {
    setStudents(
      students.map((s) =>
        s.regNo === regNo ? { ...s, status: "Active" } : s
      )
    );
  };

  return (
    <div className="student-container">
      <div className="header">
        <div>
          <h1>Student Management</h1>
          <p>Manage student registrations and mess status</p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or registration number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Students</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Leave">Leave</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Registration No</th>
              <th>Joining Date</th>
              <th>Leave Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.regNo}>
                  <td>{student.name}</td>
                  <td>{student.regNo}</td>
                  <td>{student.joiningDate}</td>
                  <td>{student.leaveDate || "-"}</td>
                  <td>
                    <span className={`status ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="actions">
                    {student.status === "Pending" && (
                      <button
                        className="approve"
                        onClick={() => approveStudent(student.regNo)}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="remove"
                      onClick={() => removeStudent(student.regNo)}
                    >
                      Remove
                    </button>
                    <button
                      className="view"
                      onClick={() => setViewStudent(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Student</h3>
            <input
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
            <input
              placeholder="Registration Number"
              value={newStudent.regNo}
              onChange={(e) =>
                setNewStudent({ ...newStudent, regNo: e.target.value })
              }
            />
            <input
              type="date"
              value={newStudent.joiningDate}
              onChange={(e) =>
                setNewStudent({ ...newStudent, joiningDate: e.target.value })
              }
            />
            <input
              type="date"
              value={newStudent.leaveDate}
              onChange={(e) =>
                setNewStudent({ ...newStudent, leaveDate: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button onClick={addStudent}>Add</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewStudent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Student Details</h3>
            <p><b>Name:</b> {viewStudent.name}</p>
            <p><b>Reg No:</b> {viewStudent.regNo}</p>
            <p><b>Joining:</b> {viewStudent.joiningDate}</p>
            <p><b>Status:</b> {viewStudent.status}</p>
            <button onClick={() => setViewStudent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudent;