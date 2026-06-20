import React, { useState, useMemo, useRef } from "react";
import * as faceapi from "face-api.js";
import { useMess } from "../../context/MessContext";
import "./ManageStudent.css";

function ManageStudent() {
  const { students, addStudent, updateStudent, deleteStudent, faceDescriptors, saveFaceDescriptor, deleteFaceDescriptor } = useMess();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [newStudent, setNewStudent] = useState({ name: "", email: "", regNo: "", joiningDate: "", leaveDate: "", status: "Pending" });

  // Face registration state
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceStudent, setFaceStudent] = useState(null);
  const [faceStatus, setFaceStatus] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // ===== ADD STUDENT =====
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.email.trim() || !newStudent.regNo.trim() || !newStudent.joiningDate) {
      alert("Please fill all required fields");
      return;
    }
    const email = newStudent.email.toLowerCase().trim();
    const exists = students.some((s) => s.email === email);
    if (exists) { alert("A student with this email already exists."); return; }

    await addStudent({
      name: newStudent.name.trim(),
      email,
      regNo: newStudent.regNo.trim(),
      joiningDate: newStudent.joiningDate,
      leaveDate: newStudent.leaveDate,
      status: newStudent.status,
      date: new Date().toLocaleDateString(),
      uid: null,
    });
    setNewStudent({ name: "", email: "", regNo: "", joiningDate: "", leaveDate: "", status: "Pending" });
  };

  const approveStudent = async (id) => await updateStudent(id, { status: "Active" });
  const handleDeleteStudent = async (id) => await deleteStudent(id);

  // ===== FACE REGISTRATION =====
  const openFaceRegistration = async (student) => {
    setFaceStudent(student);
    setFaceStatus("Loading face detection models...");
    setShowFaceModal(true);
    try {
      if (!modelsLoaded) {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      }
      setFaceStatus("Starting camera...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 300);
      setFaceStatus("Camera ready. Position the student's face and click Capture.");
    } catch (err) {
      setFaceStatus("Error: " + err.message);
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !modelsLoaded) return;
    setFaceStatus("Detecting face...");
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceStatus("No face detected. Ensure face is clearly visible and try again.");
        return;
      }

      await saveFaceDescriptor(faceStudent.email, faceStudent.name, detection.descriptor);
      setFaceStatus(`✅ Face registered successfully for ${faceStudent.name}!`);

      if (stream) stream.getTracks().forEach(t => t.stop());
      setTimeout(() => closeFaceModal(), 2000);
    } catch (err) {
      setFaceStatus("Error: " + err.message);
    }
  };

  const closeFaceModal = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setShowFaceModal(false);
    setFaceStatus("");
    setFaceStudent(null);
    setStream(null);
  };

  // ===== FILTER =====
  const filteredStudents = useMemo(() => {
    let result = students;
    if (filter !== "All") result = result.filter((s) => s.status === filter);
    if (search)
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.regNo.toLowerCase().includes(search.toLowerCase())
      );
    return result;
  }, [students, filter, search]);

  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const pending = students.filter((s) => s.status === "Pending").length;

  return (
    <div className="student-container">
      <h1>Student Management</h1>
      <p className="subtitle">Manage student registrations and mess status</p>

      <div className="summary-grid">
        <div className="card"><h4>Total Students</h4><h2>{total}</h2></div>
        <div className="card active-card"><h4>Active</h4><h2>{active}</h2></div>
        <div className="card pending-card"><h4>Pending</h4><h2>{pending}</h2></div>
      </div>

      <form className="student-form" onSubmit={handleAddStudent}>
        <input type="text" placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
        <input type="email" placeholder="Student Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
        <input type="text" placeholder="Registration Number" value={newStudent.regNo} onChange={(e) => setNewStudent({ ...newStudent, regNo: e.target.value })} />
        <input type="date" value={newStudent.joiningDate} onChange={(e) => setNewStudent({ ...newStudent, joiningDate: e.target.value })} />
        <input type="date" placeholder="Leave Date (Optional)" value={newStudent.leaveDate} onChange={(e) => setNewStudent({ ...newStudent, leaveDate: e.target.value })} />
        <select value={newStudent.status} onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Leave">Leave</option>
        </select>
        <button type="submit">Add Student</button>
      </form>

      <div className="filter-tabs">
        {["All", "Active", "Pending", "Leave"].map((tab) => (
          <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>
        ))}
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search by name or registration number..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="student-list">
        {filteredStudents.map((s) => (
          <div key={s.id} className={`student-card ${s.status.toLowerCase()}`}>
            <div className="student-header">
              <h3>{s.name}</h3>
              <span className={s.status === "Active" ? "badge active-badge" : s.status === "Pending" ? "badge pending-badge" : "badge leave-badge"}>
                {s.status}
              </span>
            </div>
            <p>Registration: {s.regNo}</p>
            <p>Email: {s.email}</p>
            <p>Joining Date: {s.joiningDate}</p>
            {s.leaveDate && <p>Leave Date: {s.leaveDate}</p>}
            <div className="student-footer">
              <span>Added: {s.date}</span>
              <div className="actions">
                {faceDescriptors.some(f => f.email === s.email) && (
                  <span style={{ color: "#10b981", fontSize: 12, marginRight: 6 }}>✓ Face Saved</span>
                )}
                <button
                  onClick={() => openFaceRegistration(s)}
                  style={{ background: "#8b5cf6", color: "white", border: "none", padding: "5px 10px", borderRadius: 5, cursor: "pointer", marginRight: 6, fontSize: 13 }}
                >
                  {faceDescriptors.some(f => f.email === s.email) ? "Re-register Face" : "Register Face"}
                </button>
                {s.status === "Pending" && (
                  <button className="approve-btn" onClick={() => approveStudent(s.id)}>Approve</button>
                )}
                <button className="delete-btn" onClick={() => handleDeleteStudent(s.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && <p className="empty">No students found</p>}
      </div>

      {/* Face Registration Modal */}
      {showFaceModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <h3 style={{ marginBottom: 8 }}>Register Face</h3>
            <p style={{ color: "#64748b", marginBottom: 16, fontSize: 14 }}>
              Student: <strong>{faceStudent?.name}</strong>
            </p>
            <video ref={videoRef} autoPlay muted style={{ width: "100%", borderRadius: 10, background: "#0f1117", marginBottom: 16, minHeight: 240 }} />
            <p style={{ fontSize: 13, color: faceStatus.includes("✅") ? "#10b981" : "#64748b", marginBottom: 16, minHeight: 20 }}>
              {faceStatus}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={captureFace} disabled={!modelsLoaded || !stream}
                style={{ flex: 1, padding: "11px", background: (modelsLoaded && stream) ? "#6366f1" : "#a5b4fc", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: (modelsLoaded && stream) ? "pointer" : "not-allowed" }}>
                Capture Face
              </button>
              <button onClick={closeFaceModal}
                style={{ flex: 1, padding: "11px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudent;
