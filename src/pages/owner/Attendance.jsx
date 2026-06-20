import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { useMess } from "../../context/MessContext";
import { FaCamera, FaStop, FaClock, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import "./Attendance.css";

const Attendance = () => {
  const { faceDescriptors, attendance, addAttendanceRecord } = useMess();

  const videoRef = useRef(null);
  const detectionRef = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Click Start Camera to begin attendance marking.");
  const [statusType, setStatusType] = useState("info");
  const [lastMarked, setLastMarked] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterMeal, setFilterMeal] = useState("All");

  // Keep a ref to faceDescriptors so the detection loop always has latest value
  const faceDescriptorsRef = useRef(faceDescriptors);
  useEffect(() => { faceDescriptorsRef.current = faceDescriptors; }, [faceDescriptors]);

  const attendanceRef = useRef(attendance);
  useEffect(() => { attendanceRef.current = attendance; }, [attendance]);

  const getCurrentMeal = () => {
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const time = hour + min / 60;
    if (time >= 7 && time <= 10.5) return "Breakfast";
    if (time >= 12 && time <= 15) return "Lunch";
    if (time >= 19 && time <= 22) return "Dinner";
    return "TestMeal"; // remove this in production, use null
  };

  const startCamera = async () => {
    try {
      setStatusMessage("Loading face recognition models...");
      setStatusType("info");

      if (!modelsLoaded) {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsRunning(true);
      setStatusMessage("Camera started. Scanning for faces...");
      setStatusType("info");
      startDetectionLoop();

    } catch (err) {
      setStatusMessage("Error: " + err.message);
      setStatusType("error");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (detectionRef.current) clearInterval(detectionRef.current);
    setIsRunning(false);
    setStream(null);
    setStatusMessage("Camera stopped.");
    setStatusType("info");
    setIsDetecting(false);
  };

  const startDetectionLoop = () => {
    detectionRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const descriptors = faceDescriptorsRef.current;
      if (!descriptors || descriptors.length === 0) {
        setStatusMessage("No face descriptors registered. Register student faces first.");
        setStatusType("warning");
        return;
      }

      const currentMeal = getCurrentMeal();
      if (!currentMeal) {
        setStatusMessage("No active meal time. Attendance during Breakfast (7-10:30am), Lunch (12-3pm), Dinner (7-10pm).");
        setStatusType("warning");
        return;
      }

      setIsDetecting(true);

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          setStatusMessage("Scanning... No face detected. Look directly at the camera.");
          setStatusType("info");
          setIsDetecting(false);
          return;
        }

        // Build labeled descriptors from Firestore data
        const labeledDescriptors = descriptors.map(fd => {
          const arr = Array.isArray(fd.descriptor)
            ? fd.descriptor
            : Object.values(fd.descriptor);
          return new faceapi.LabeledFaceDescriptors(fd.email, [new Float32Array(arr)]);
        });

        const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
        const match = matcher.findBestMatch(detection.descriptor);

        console.log("Match result:", match.toString());

        if (match.label === "unknown") {
          setStatusMessage("Face detected but not recognized. Student may not have face registered.");
          setStatusType("warning");
          setIsDetecting(false);
          return;
        }

        const studentEmail = match.label;
        const today = new Date().toISOString().slice(0, 10);

        // Check if already marked today for this meal
        const alreadyMarked = attendanceRef.current.some(
          a => a.studentEmail === studentEmail && a.date === today && a.meal === currentMeal
        );

        if (alreadyMarked) {
          const fd = descriptors.find(f => f.email === studentEmail);
          setStatusMessage(`${fd?.name || studentEmail} already marked for ${currentMeal} today.`);
          setStatusType("info");
          setIsDetecting(false);
          return;
        }

        const fd = descriptors.find(f => f.email === studentEmail);
        const newRecord = {
          studentEmail,
          studentName: fd?.name || studentEmail,
          date: today,
          meal: currentMeal,
          status: "Present",
          timestamp: new Date().toLocaleTimeString(),
        };

        await addAttendanceRecord(newRecord);
        setLastMarked(newRecord);
        setStatusMessage(`✅ Attendance marked! ${fd?.name || studentEmail} — ${currentMeal}`);
        setStatusType("success");

      } catch (err) {
        console.error("Detection error:", err);
        setStatusMessage("Detection error: " + err.message);
        setStatusType("error");
      }

      setIsDetecting(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (detectionRef.current) clearInterval(detectionRef.current);
    };
  }, [stream]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAttendance = attendance.filter(a => {
    const matchDate = a.date === filterDate;
    const matchMeal = filterMeal === "All" || a.meal === filterMeal;
    return matchDate && matchMeal;
  });

  const currentMeal = getCurrentMeal();

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance System</h1>
        <p>Automatic face recognition attendance marking</p>
      </div>

      {/* Meal & Time indicator */}
      <div className="meal-indicator">
        <div className="clock">
          <FaClock style={{ marginRight: 8 }} />
          {currentTime}
        </div>
        <div className={currentMeal ? "meal-active" : "meal-inactive"}>
          {currentMeal ? `${currentMeal} Time Active` : "No active meal time"}
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Face descriptors loaded: <strong>{faceDescriptors.length}</strong>
        </div>
      </div>

      {/* Camera section */}
      <div className="camera-section">
        <video ref={videoRef} autoPlay muted playsInline
          style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "#0f1117", display: "block", margin: "0 auto" }} />

        <div className={`status-message status-${statusType}`} style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, textAlign: "center", fontWeight: 500 }}>
          {statusMessage}
        </div>

        <div className="camera-controls" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
          <button className="start-btn" onClick={startCamera} disabled={isRunning}>
            <FaCamera style={{ marginRight: 6 }} /> Start Camera
          </button>
          <button className="stop-btn" onClick={stopCamera} disabled={!isRunning}>
            <FaStop style={{ marginRight: 6 }} /> Stop Camera
          </button>
        </div>

        {isDetecting && (
          <div style={{ textAlign: "center", marginTop: 8, color: "#6366f1", fontSize: 13 }}>
            <span>🔍 Scanning...</span>
          </div>
        )}
      </div>

      {/* Last marked */}
      {lastMarked && (
        <div className="last-marked-card" style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "14px 20px", margin: "16px 0" }}>
          <h4 style={{ margin: 0, color: "#15803d" }}><FaUserCheck style={{ marginRight: 8 }} />Last Attendance Marked</h4>
          <p style={{ margin: "6px 0 0", color: "#166534" }}>{lastMarked.studentName} — {lastMarked.meal} — {lastMarked.timestamp}</p>
        </div>
      )}

      {/* Records */}
      <div className="records-section">
        <h3><FaCalendarAlt style={{ marginRight: 8 }} />Attendance Records</h3>
        <div className="records-filters" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <select value={filterMeal} onChange={(e) => setFilterMeal(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <option value="All">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {filteredAttendance.length > 0 ? (
          <table className="attendance-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Name", "Email", "Meal", "Date", "Time", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>{record.studentName}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{record.studentEmail}</td>
                  <td style={{ padding: "12px 16px" }}>{record.meal}</td>
                  <td style={{ padding: "12px 16px" }}>{record.date}</td>
                  <td style={{ padding: "12px 16px" }}>{record.timestamp}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Present</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p>No attendance records found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
