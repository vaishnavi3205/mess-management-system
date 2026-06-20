import { useState } from "react";
import { useMess } from "../../context/MessContext";

const LeaveRequests = () => {
  const { leaves, updateLeave } = useMess();
  const [filter, setFilter] = useState("All");

  const updateLeaveStatus = async (leaveId, newStatus) => {
    await updateLeave(leaveId, { status: newStatus });
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "All") return true;
    return leave.status === filter;
  });

  const totalRequests = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Pending": return { background: "#fffbeb", color: "#b45309" };
      case "Approved": return { background: "#dcfce7", color: "#15803d" };
      case "Rejected": return { background: "#fef2f2", color: "#dc2626" };
      default: return { background: "#f1f5f9", color: "#64748b" };
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
          Leave Requests
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>Review and manage student leave applications</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Total Requests", value: totalRequests, color: "#1e293b" },
          { label: "Pending", value: pendingCount, color: "#b45309" },
          { label: "Approved", value: approvedCount, color: "#15803d" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", padding: "24px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h4 style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: "600" }}>{label}</h4>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color, margin: 0 }}>{value}</h2>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        {["All", "Pending", "Approved", "Rejected"].map((filterOption) => (
          <button key={filterOption} onClick={() => setFilter(filterOption)}
            style={{
              padding: "8px 16px", marginRight: "8px", border: "1px solid #e2e8f0", borderRadius: "8px",
              background: filter === filterOption ? "#6366f1" : "#fff",
              color: filter === filterOption ? "#fff" : "#64748b",
              fontSize: "14px", fontWeight: "500", cursor: "pointer",
            }}>
            {filterOption}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {filteredLeaves.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Email", "From Date", "To Date", "Reason", "Applied Date", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => (
                <tr key={leave.id} style={{ background: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#1e293b" }}>{leave.studentEmail}</td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#1e293b" }}>{leave.fromDate}</td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#1e293b" }}>{leave.toDate}</td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#1e293b" }}>{leave.reason}</td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "#64748b" }}>{leave.appliedDate}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", ...getStatusBadgeStyle(leave.status) }}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {leave.status === "Pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => updateLeaveStatus(leave.id, "Approved")}
                          style={{ padding: "6px 12px", background: "#15803d", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                          Approve
                        </button>
                        <button onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                          style={{ padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "64px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>No leave requests found</h3>
            <p style={{ fontSize: "14px" }}>
              {filter === "All" ? "No students have submitted leave requests yet." : `No ${filter.toLowerCase()} leave requests found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
