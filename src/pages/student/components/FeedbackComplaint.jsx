import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import { FaStar } from "react-icons/fa";
import "./FeedbackComplaint.css";

const FeedbackComplaint = () => {
  const { user } = useAuth();
  const { complaints, addComplaint } = useMess();
  const [errors, setErrors] = useState({});
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, message: "" });
  const [complaintForm, setComplaintForm] = useState({ title: "", description: "" });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackForm.rating === 0 || !feedbackForm.message.trim()) {
      setErrors({ feedback: "Please provide both rating and message" });
      return;
    }
    await addComplaint({
      student: user.email,
      title: "Feedback",
      description: feedbackForm.message,
      rating: feedbackForm.rating,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    });
    setFeedbackForm({ rating: 0, message: "" });
    setErrors({});
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) {
      setErrors({ complaint: "Please fill all fields" });
      return;
    }
    await addComplaint({
      student: user.email,
      title: complaintForm.title,
      description: complaintForm.description,
      rating: 0,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    });
    setComplaintForm({ title: "", description: "" });
    setErrors({});
  };

  const studentComplaints = complaints.filter((c) => c.student === user.email);

  return (
    <div className="tab-content">
      <h2>Feedback & Complaint</h2>

      <div className="feedback-section">
        <h3>Submit Feedback</h3>
        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star}
                  className={`star ${star <= feedbackForm.rating ? "active" : ""}`}
                  onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })} />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Feedback Message</label>
            <textarea value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
              placeholder="Share your feedback..." rows="3" />
          </div>
          {errors.feedback && <span className="error-message">{errors.feedback}</span>}
          <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>
      </div>

      <div className="complaint-section">
        <h3>Submit Complaint</h3>
        <form onSubmit={handleComplaintSubmit} className="complaint-form">
          <div className="form-group">
            <label>Complaint Title</label>
            <input type="text" value={complaintForm.title}
              onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
              placeholder="Brief title for your complaint" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={complaintForm.description}
              onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              placeholder="Describe your complaint in detail..." rows="4" />
          </div>
          {errors.complaint && <span className="error-message">{errors.complaint}</span>}
          <button type="submit" className="submit-btn">Submit Complaint</button>
        </form>
      </div>

      <div className="complaints-history">
        <h3>My Complaints & Feedback</h3>
        {studentComplaints.length > 0 ? (
          <div className="complaints-list">
            {studentComplaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <h4>{complaint.title}</h4>
                  <span className={`status-badge ${complaint.status.toLowerCase()}`}>{complaint.status}</span>
                </div>
                <p>{complaint.description}</p>
                {complaint.rating > 0 && (
                  <div className="rating-display">
                    {[...Array(complaint.rating)].map((_, i) => (
                      <FaStar key={i} className="star active" />
                    ))}
                  </div>
                )}
                <span className="complaint-date">{complaint.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-emoji">💬</span>
            <h3>No Complaints Yet</h3>
            <p>You haven't submitted any complaints or feedback yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackComplaint;
