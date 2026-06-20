import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import "./LeaveApplication.css";

const LeaveApplication = () => {
  const { user } = useAuth();
  const { leaves, addLeave } = useMess();
  const [errors, setErrors] = useState({});
  const [leaveForm, setLeaveForm] = useState({ fromDate: "", toDate: "", reason: "" });

  // Only show this student's leaves
  const leaveApplications = leaves.filter((l) => l.studentEmail === user.email);

  const validateLeaveForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    if (!leaveForm.fromDate) newErrors.fromDate = "From date is required";
    else if (leaveForm.fromDate < today) newErrors.fromDate = "From date cannot be in the past";
    if (!leaveForm.toDate) newErrors.toDate = "To date is required";
    else if (leaveForm.toDate <= leaveForm.fromDate) newErrors.toDate = "To date must be after from date";
    if (!leaveForm.reason.trim()) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!validateLeaveForm()) return;
    await addLeave({
      studentEmail: user.email,
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      reason: leaveForm.reason,
      status: "Pending",
      appliedDate: new Date().toLocaleDateString(),
    });
    setLeaveForm({ fromDate: "", toDate: "", reason: "" });
    setErrors({});
  };

  return (
    <div className="tab-content">
      <h2>Leave Application</h2>
      <div className="leave-form-card">
        <h3>Apply for Leave</h3>
        <form onSubmit={handleLeaveSubmit}>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" value={leaveForm.fromDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })} />
            {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" value={leaveForm.toDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })} />
            {errors.toDate && <span className="error-message">{errors.toDate}</span>}
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="Enter reason for leave..." rows="3" />
            {errors.reason && <span className="error-message">{errors.reason}</span>}
          </div>
          <button type="submit" className="submit-btn">Submit Application</button>
        </form>
      </div>

      <div className="leave-history">
        <h3>Leave History</h3>
        {leaveApplications.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>From</th><th>To</th><th>Reason</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.fromDate}</td>
                    <td>{leave.toDate}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-emoji">📝</span>
            <h3>No Leave Applications</h3>
            <p>You haven't applied for any leave yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;
