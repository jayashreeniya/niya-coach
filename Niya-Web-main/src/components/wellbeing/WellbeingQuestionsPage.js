import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./wellbeingAssessment.css";
import {
  ensureCoacheeAccess,
  fetchWellbeingQuestions,
  submitUserAnswer,
} from "./api";

function getQuestionMeta(item) {
  const qa = item?.attributes?.question_answers || {};
  return {
    questionId: qa?.question?.id,
    questionText: qa?.question?.question || "",
    answers: Array.isArray(qa?.answers) ? qa.answers : [],
    answered: Boolean(qa?.answered),
  };
}

const WellbeingQuestionsPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];
  const currentMeta = useMemo(() => getQuestionMeta(currentQuestion), [currentQuestion]);
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const loadQuestions = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchWellbeingQuestions(categoryId);
      const list = Array.isArray(data?.data) ? data.data : [];
      // Always start at question 1 when opening from category selection.
      setQuestions(list);
      setCurrentIndex(0);
      setSelectedAnswerId("");
    } catch (e) {
      setError(e.message || "Could not load assessment questions.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!ensureCoacheeAccess(navigate)) return;
    if (!categoryId) {
      navigate("/wellbeing-assessment", { replace: true });
      return;
    }
    loadQuestions();
  }, [navigate, categoryId, loadQuestions]);

  const handleNext = async () => {
    if (!currentMeta.questionId || !selectedAnswerId) {
      alert("Please select an answer to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await submitUserAnswer(currentMeta.questionId, selectedAnswerId);
      if (response?.last_question) {
        navigate("/wellbeing-results?from=test", { state: { from: "test" } });
        return;
      }
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        navigate("/wellbeing-results?from=test", { state: { from: "test" } });
        return;
      }
      setCurrentIndex(nextIndex);
      setSelectedAnswerId("");
    } catch (e) {
      alert(e.message || "Failed to save your answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wba-page">
      <header className="wba-header">
        <img src={Logo} alt="Niya" className="wba-logo" />
        <nav className="wba-nav">
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/wellbeing-assessment")}>
            Categories
          </button>
          <button type="button" className="wba-nav-btn" onClick={() => navigate("/appointments")}>
            My Appointments
          </button>
        </nav>
      </header>

      <main className="wba-main">
        <div className="wba-hero">
          <h1>Well-Being Assessment</h1>
          <p>Answer each question honestly. Your responses help personalize your coaching experience.</p>
        </div>

        <div className="wba-card">
          {loading && <p className="wba-loading">Loading questions...</p>}
          {error && <p className="wba-error">{error}</p>}

          {!loading && !error && totalQuestions === 0 && (
            <>
              <p className="wba-empty">No questions available for this category at the moment.</p>
              <div className="wba-actions">
                <button type="button" className="wba-primary-btn" onClick={() => navigate("/wellbeing-assessment")}>
                  Go Back
                </button>
              </div>
            </>
          )}

          {!loading && !error && totalQuestions > 0 && (
            <>
              <div className="wba-progress-row">
                <div className="wba-progress-bar">
                  <div className="wba-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="wba-progress-label">
                  {currentIndex + 1}/{totalQuestions}
                </span>
              </div>

              <div className="wba-question-box">
                <p className="wba-question-text">{currentMeta.questionText}</p>
                <div className="wba-answer-list">
                  {currentMeta.answers.map((answer) => (
                    <button
                      key={answer.id}
                      type="button"
                      className={`wba-answer-option ${String(selectedAnswerId) === String(answer.id) ? "selected" : ""}`}
                      onClick={() => setSelectedAnswerId(String(answer.id))}
                    >
                      <span className="wba-radio" aria-hidden="true" />
                      <span className="wba-answer-text">{answer.answer}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="wba-actions">
                <button
                  type="button"
                  className="wba-secondary-btn"
                  disabled={submitting}
                  onClick={() => navigate("/wellbeing-assessment")}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="wba-primary-btn"
                  disabled={submitting || !selectedAnswerId}
                  onClick={handleNext}
                >
                  {submitting ? "Saving..." : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WellbeingQuestionsPage;
