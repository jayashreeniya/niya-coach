import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/niyalogo.png";
import { useNavigate } from "react-router-dom";
import "./wellbeing.css";

const API_BASE = "https://niya-backend-oiut.onrender.com";

const Wellbeing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [loginusername, setLoginUserName] = useState("");
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [answers1, setAnswers1] = useState([]);
  const [answers2, setAnswers2] = useState([]);
  const [step, setStep] = useState(1);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [upcomingQuestion, setUpcomingQuestion] = useState(null);
  const [upcomingAnswers, setUpcomingAnswers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Please login.");
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        const profileRes = await fetch(`${API_BASE}/profile_details`, {
          headers: { "Content-Type": "application/json", accept: "application/json", token },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          const fullname = profile?.data?.attributes?.full_name || "";
          const email = profile?.data?.attributes?.email || "";
          localStorage.setItem("fullname", fullname);
          localStorage.setItem("loginuseremailid", email);
          setLoginUserName(fullname);
        }

        const qRes = await fetch(`${API_BASE}/bx_block_assessmenttest/personality_test_questions`, {
          headers: { "Content-Type": "application/json", accept: "application/json", token },
        });
        if (!qRes.ok) throw new Error("Failed to load questions");
        const data = await qRes.json();
        (data.data || []).forEach((question) => {
          const attrs = question.attributes || {};
          if (attrs.sequence_number === 1) {
            setQ1({ ...attrs, id: question.id });
            setAnswers1(attrs.answers || []);
          }
          if (attrs.sequence_number === 2) {
            setQ2({ ...attrs, id: question.id });
            setAnswers2(attrs.answers || []);
          }
        });
      } catch (e) {
        console.error(e);
        alert("Could not load wellbeing questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  const submitQ1 = async (answerId) => {
    if (!q1?.id || submitting) return;
    setSelected1(String(answerId));
    setSubmitting(true);
    try {
      // Advance UI; optional persist via choose_answers if backend accepts sequence 1
      const res = await fetch(`${API_BASE}/bx_block_assessmenttest/choose_answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json", token },
        body: JSON.stringify({
          sequence_number: 1,
          question_id: q1.id,
          answer_id: answerId,
        }),
      });
      // Even if persist fails on older backends, still continue the flow
      if (!res.ok) {
        console.warn("Q1 persist failed; continuing to next step");
      }
      setStep(2);
    } catch (e) {
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  };

  const submitQ2 = async (answer) => {
    if (submitting) return;
    const answerId = answer.id;
    const questionId = answer.assesment_test_question_id || q2?.id;
    setSelected2(String(answerId));
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/bx_block_assessmenttest/choose_answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json", token },
        body: JSON.stringify({
          sequence_number: 2,
          question_id: String(questionId),
          answer_id: String(answerId),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const attrs = data?.data?.attributes || {};
      const nextQ = attrs.upcoming_question || {};
      const nextAnswers = attrs.upcoming_answers || [];
      setUpcomingQuestion({
        id: nextQ.id,
        title: nextQ.title || nextQ.question_title || "",
      });
      setUpcomingAnswers(
        (Array.isArray(nextAnswers) ? nextAnswers : []).map((a) => ({
          id: a.id,
          answers: a.answers || a.answer_title || "",
        }))
      );
      setChecked([]);
      setStep(3);
    } catch (e) {
      alert("Failed to save answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCheck = (id) => {
    setChecked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        alert("Please select only up to 3 answers.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const submitQ3 = async () => {
    if (!upcomingQuestion?.id) {
      alert("Question 3 data is not available. Please refresh and try again.");
      return;
    }
    if (checked.length === 0) {
      alert("Please select at least one answer.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/bx_block_assessmenttest/select_answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json", token },
        body: JSON.stringify({ question_id: upcomingQuestion.id, answer_ids: checked }),
      });
      if (!res.ok) throw new Error("Failed");
      // Keep existing focus area flow if present in old code path via bookappointment
      navigate("/bookappointment");
    } catch (e) {
      alert("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const q3Title =
    upcomingQuestion?.title ||
    upcomingQuestion?.question_title ||
    "Choose what matters most to you";

  return (
    <div className="wb-page">
      <div className="wb-shell">
        <div className="wb-header">
          <img src={Logo} alt="Niya" />
          <button type="button" className="wb-skip" onClick={() => navigate("/appointments")}>
            Skip to My Appointments
          </button>
        </div>

        {loading ? (
          <div className="wb-card wb-loading">Loading your wellbeing check-in...</div>
        ) : (
          <div className="wb-card">
            <div className="wb-progress">
              <div className={`wb-dot ${step > 1 ? "done" : ""} ${step === 1 ? "active" : ""}`} />
              <div className={`wb-dot ${step > 2 ? "done" : ""} ${step === 2 ? "active" : ""}`} />
              <div className={`wb-dot ${step === 3 ? "active" : ""}`} />
            </div>

            <p className="wb-eyebrow">Step {step} of 3</p>

            {step === 1 && (
              <>
                <h1 className="wb-title">
                  {loginusername ? `${loginusername}, ` : ""}
                  {q1?.title || "How are you feeling?"}
                </h1>
                <p className="wb-subtitle">Pick the option that fits you best right now.</p>
                <div className="wb-options">
                  {answers1.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`wb-option ${selected1 === String(a.id) ? "selected" : ""}`}
                      disabled={submitting}
                      onClick={() => submitQ1(a.id)}
                    >
                      {a.answers}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="wb-title">
                  {loginusername ? `${loginusername}, ` : ""}
                  {q2?.title || "Tell us a little more"}
                </h1>
                <p className="wb-subtitle">One choice helps us match you better.</p>
                <div className="wb-options">
                  {answers2.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`wb-option ${selected2 === String(a.id) ? "selected" : ""}`}
                      disabled={submitting}
                      onClick={() => submitQ2(a)}
                    >
                      {a.answers}
                    </button>
                  ))}
                </div>
                <div className="wb-actions">
                  <button type="button" className="wb-secondary" onClick={() => setStep(1)}>
                    Back
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="wb-title">
                  {loginusername ? `${loginusername}, ` : ""}
                  {q3Title}
                </h1>
                <p className="wb-subtitle">Select up to 3 options.</p>
                <div className="wb-options">
                  {upcomingAnswers.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`wb-option ${checked.includes(a.id) ? "selected" : ""}`}
                      onClick={() => toggleCheck(a.id)}
                    >
                      {a.answers}
                    </button>
                  ))}
                </div>
                <p className="wb-hint">{checked.length}/3 selected</p>
                <div className="wb-actions">
                  <button type="button" className="wb-secondary" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button type="button" className="wb-primary" disabled={submitting || checked.length === 0} onClick={submitQ3}>
                    {submitting ? "Saving..." : "Continue to book"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wellbeing;
