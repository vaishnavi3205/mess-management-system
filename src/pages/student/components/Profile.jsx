import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { FaLeaf, FaDrumstickBite, FaExchangeAlt, FaEdit, FaTimes } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const { updateStudent } = useMess();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vegPreference, setVegPreference] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileForm, setProfileForm] = useState({ name: "", regNo: "", joiningDate: "", leaveDate: "" });

  // Fetch student data using UID as document ID — real-time
  useEffect(() => {
    if (!user?.uid) return;

    // Real-time listener on students/{uid}
    const unsub = onSnapshot(doc(db, "students", user.uid), (snap) => {
      if (snap.exists()) {
        setStudentData({ id: snap.id, ...snap.data() });
      } else {
        setStudentData(null);
      }
      setLoading(false);
    });

    const savedVegPref = localStorage.getItem(`veg_preference_${user.uid}`);
    if (savedVegPref !== null) setVegPreference(JSON.parse(savedVegPref));

    return unsub;
  }, [user?.uid]);

  const getInitials = (email) => email?.substring(0, 2).toUpperCase() || "??";

  const handleVegPreferenceChange = () => {
    const newPref = !vegPreference;
    setVegPreference(newPref);
    localStorage.setItem(`veg_preference_${user.uid}`, JSON.stringify(newPref));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.regNo.trim() || !profileForm.joiningDate) {
      setErrors({ profile: "Please fill all required fields" });
      return;
    }
    await updateStudent(user.uid, {
      email: user.email,
      name: profileForm.name,
      regNo: profileForm.regNo,
      joiningDate: profileForm.joiningDate,
      leaveDate: profileForm.leaveDate,
      status: studentData.status,
    });
    setShowProfileForm(false);
    setProfileForm({ name: "", regNo: "", joiningDate: "", leaveDate: "" });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="tab-content">
        <h2>My Profile</h2>
        <p style={{ color: "#64748b", marginTop: 16 }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>My Profile</h2>

      {studentData ? (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {getInitials(user.email)}
            </div>
            <div className="profile-info">
              <h3>{studentData.name || user.email}</h3>
              <span className="role-badge">Student</span>
            </div>
            <button
              className="edit-profile-btn"
              onClick={() => {
                setProfileForm({
                  name: studentData.name || "",
                  regNo: studentData.regNo || "",
                  joiningDate: studentData.joiningDate || "",
                  leaveDate: studentData.leaveDate || "",
                });
                setShowProfileForm(true);
              }}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{studentData.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Registration Number:</span>
              <span className="value">{studentData.regNo}</span>
            </div>
            <div className="detail-row">
              <span className="label">Joining Date:</span>
              <span className="value">{studentData.joiningDate}</span>
            </div>
            <div className="detail-row">
              <span className="label">End Date:</span>
              <span className="value">{studentData.leaveDate || "Not set"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Food Preference:</span>
              <div className="preference-toggle">
                <button
                  className={`pref-btn ${vegPreference ? "active" : ""}`}
                  onClick={handleVegPreferenceChange}
                >
                  <FaLeaf /> Vegetarian
                </button>
                <button
                  className={`pref-btn ${!vegPreference ? "active" : ""}`}
                  onClick={handleVegPreferenceChange}
                >
                  <FaDrumstickBite /> Non-Vegetarian
                </button>
              </div>
            </div>
          </div>

          <button
            className="change-mess-btn"
            onClick={() => alert("Feature coming soon")}
          >
            <FaExchangeAlt /> Change Mess
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">👤</span>
          <h3>Profile Not Available</h3>
          <p>Your profile will appear here once the mess owner registers you in the system.</p>
        </div>
      )}

      {showProfileForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setShowProfileForm(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Registration Number *</label>
                <input
                  type="text"
                  value={profileForm.regNo}
                  onChange={(e) => setProfileForm({ ...profileForm, regNo: e.target.value })}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="form-group">
                <label>Joining Date *</label>
                <input
                  type="date"
                  value={profileForm.joiningDate}
                  onChange={(e) => setProfileForm({ ...profileForm, joiningDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={profileForm.leaveDate}
                  onChange={(e) => setProfileForm({ ...profileForm, leaveDate: e.target.value })}
                />
              </div>
              {errors.profile && <span className="error-message">{errors.profile}</span>}
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Update Profile</button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfileForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
