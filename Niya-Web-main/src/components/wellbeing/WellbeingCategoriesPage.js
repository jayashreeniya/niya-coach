import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "../login/myAppointments.css";
import "./wellbeingAssessment.css";
import {
  ensureCoacheeAccess,
  fetchAllCategories,
  fetchInsightsData,
  restartCategoryAssessment,
} from "./api";

const WellbeingCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [retakeInfo, setRetakeInfo] = useState({ categoryName: "", lastTakenOn: "" });

  const fullname = localStorage.getItem("fullname") || "";

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (e) {
      setError(e.message || "Could not load assessment categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ensureCoacheeAccess(navigate)) return;
    loadCategories();
  }, [navigate, loadCategories]);

  const goToQuestions = async (resetAnswers = true) => {
    if (!selectedCategoryId) return;
    if (resetAnswers) {
      try {
        await restartCategoryAssessment(selectedCategoryId);
      } catch (_) {
        // If restart API is unavailable, questions page still starts at Q1.
      }
    }
    navigate(`/wellbeing-assessment/${selectedCategoryId}`);
  };

  const handleNext = async () => {
    if (!selectedCategoryId) {
      alert("Please select a category to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await fetchInsightsData(selectedCategoryId);
      const lastTaken = data?.data?.last_test_taken_on;
      if (lastTaken) {
        setRetakeInfo({
          categoryName: data?.data?.category_name || "this",
          lastTakenOn: lastTaken,
        });
        setShowRetakeModal(true);
      } else {
        await goToQuestions(true);
      }
    } catch (e) {
      alert(e.message || "Could not verify assessment status. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="wba-page">
      <header className="wba-header">
        <img src={Logo} alt="Niya" className="wba-logo" />
        <nav className="wba-nav">
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/appointments")}>
            My Appointments
          </button>
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/bookappointment")}>
            Book Appointment
          </button>
          <button type="button" className="wba-nav-btn" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="wba-main">
        <div className="wba-hero">
          <h1>Well-Being Assessment</h1>
          <p>
            {fullname ? `Hello, ${fullname}. ` : ""}
            I would like to personalize your experience here. Please complete this assessment.
          </p>
        </div>

        <div className="wba-card">
          <h2>Choose a category to start assessment</h2>
          <p className="wba-subtitle">Select one category, then continue to the questions.</p>

          {loading && <p className="wba-loading">Loading categories...</p>}
          {error && <p className="wba-error">{error}</p>}

          {!loading && !error && categories.length === 0 && (
            <p className="wba-empty">No assessment categories are available right now.</p>
          )}

          {!loading && categories.length > 0 && (
            <>
              <div className="wba-category-list">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`wba-category-btn ${String(selectedCategoryId) === String(cat.id) ? "selected" : ""}`}
                    onClick={() => setSelectedCategoryId(String(cat.id))}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>

              <div className="wba-actions">
                <button type="button" className="wba-secondary-btn" onClick={() => navigate("/appointments")}>
                  Back
                </button>
                <button
                  type="button"
                  className="wba-primary-btn"
                  disabled={!selectedCategoryId || submitting}
                  onClick={handleNext}
                >
                  {submitting ? "Checking..." : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {showRetakeModal && (
        <div className="wba-modal-overlay" role="dialog" aria-modal="true">
          <div className="wba-modal">
            <p>
              {`You have taken the ${retakeInfo.categoryName} Assessment earlier on ${retakeInfo.lastTakenOn}, do you wish to do it again?`}
            </p>
            <div className="wba-modal-actions">
              <button
                type="button"
                className="wba-primary-btn"
                onClick={async () => {
                  setShowRetakeModal(false);
                  setSubmitting(true);
                  try {
                    await goToQuestions(true);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                Yes
              </button>
              <button type="button" className="wba-secondary-btn" onClick={() => setShowRetakeModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellbeingCategoriesPage;
