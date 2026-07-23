import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./feedback.css";

const API_BASE = "https://niya-backend-oiut.onrender.com";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coachId = location.state?.coachId;

  const [coachRating, setCoachRating] = useState(0);
  const [appRating, setAppRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!coachRating || !appRating) {
      setError("Please rate both the coach and the app.");
      return;
    }
    if (!coachId) {
      setError("Missing coach details. Returning to appointments.");
      setTimeout(() => navigate("/appointments"), 1500);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/account_block/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          rating: {
            app_rating: appRating,
            coach_rating: coachRating,
            coach_id: coachId,
            feedback,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.errors || "Failed to submit feedback");
      }
      navigate("/appointments");
    } catch (err) {
      setError(typeof err.message === "string" ? err.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRow = ({ value, onChange, label }) => (
    <div className="star-row">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= value ? "star active" : "star"}
            onClick={() => onChange(n)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <img src={Logo} alt="Niya" />
        <h1>Session Feedback</h1>
        <p>How was your coaching session?</p>

        <form onSubmit={submit}>
          <StarRow label="Rate your coach" value={coachRating} onChange={setCoachRating} />
          <StarRow label="Rate the Niya experience" value={appRating} onChange={setAppRating} />

          <label className="feedback-label" htmlFor="feedback">
            Comments (optional)
          </label>
          <textarea
            id="feedback"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
          />

          {error && <p className="feedback-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
          <button type="button" className="skip-btn" onClick={() => navigate("/appointments")}>
            Skip
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
