import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./login.css";
import "./myAppointments.css";

const API_BASE = "https://niya-backend-oiut.onrender.com";

function parseSlotWindow(viewableSlot) {
  if (!viewableSlot || typeof viewableSlot !== "string") return null;
  const parts = viewableSlot.split(" - ").map((s) => s.trim());
  if (parts.length !== 2) return null;

  const parsePart = (part) => {
    // Expected: DD/MM/YYYY HH:mm
    const m = part.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const day = Number(m[1]);
    const month = Number(m[2]) - 1;
    const year = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    return new Date(year, month, day, hour, minute, 0, 0);
  };

  const start = parsePart(parts[0]);
  const end = parsePart(parts[1]);
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start, end };
}

function isWithinWindow(viewableSlot, now = new Date()) {
  const window = parseSlotWindow(viewableSlot);
  if (!window) return false;
  return now >= window.start && now <= window.end;
}

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());
  const [connectingId, setConnectingId] = useState(null);

  const loadAppointments = useCallback(async () => {
    let authToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (authToken && !localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", authToken);
      localStorage.setItem("authenticated", "true");
    }
    if (!authToken) {
      navigate("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/bx_block_calendar/booked_slots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: authToken,
        },
      });
      const data = await res.json();
      if (data?.errors) {
        setAppointments([]);
        setError("");
      } else if (Array.isArray(data?.data)) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }
    } catch (e) {
      setError("Could not load appointments. Please try again.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "coach") {
      navigate("/coach-appointments");
      return;
    }
    loadAppointments();
  }, [loadAppointments, navigate]);

  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const startCall = async (item) => {
    const authToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const slotId = item.id;
    const coachId = item?.attributes?.coach_details?.id;
    const meetingCode = item?.attributes?.meeting_code || "";
    setConnectingId(slotId);
    try {
      const res = await fetch(
        `${API_BASE}/bx_block_calendar/booked_slots/video_call?booked_slot_id=${slotId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: authToken,
          },
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.meeting_token) {
        throw new Error(data?.errors || data?.detail || "Failed to start video call");
      }
      navigate("/video-call", {
        state: {
          meetingToken: data.meeting_token,
          meetingCode: data.meeting_code || meetingCode,
          bookedSlotId: slotId,
          coachId,
          role: "coachee",
        },
      });
    } catch (e) {
      alert(typeof e.message === "string" ? e.message : "Failed to start video call");
    } finally {
      setConnectingId(null);
    }
  };

  void nowTick;

  return (
    <div className="appointments-page">
      <header className="appointments-header">
        <img src={Logo} alt="Niya" className="appointments-logo" />
        <nav className="appointments-nav">
          <button type="button" className="nav-link active" onClick={() => navigate("/appointments")}>
            My Appointments
          </button>
          <button type="button" className="nav-link" onClick={() => navigate("/bookappointment")}>
            Book Appointment
          </button>
          <button type="button" className="nav-link" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="appointments-main">
        <div className="home-hero">
          <div>
            <h1>Welcome{localStorage.getItem("fullname") ? `, ${localStorage.getItem("fullname")}` : ""}</h1>
            <p>View your sessions, join with Connect Now, or book a new appointment.</p>
          </div>
          <div className="home-actions">
            <button type="button" className="primary-btn" onClick={() => navigate("/bookappointment")}>
              Book Appointment
            </button>
            <button type="button" className="refresh-btn" onClick={() => navigate("/wellbeingquestions")}>
              Wellbeing check-in
            </button>
            <button type="button" className="refresh-btn" onClick={loadAppointments} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="appointments-title-row">
          <div>
            <h1 style={{ fontSize: 22 }}>My Appointments</h1>
            <p>Connect Now is enabled only during your booked time.</p>
          </div>
        </div>

        {loading && <p className="appointments-status">Loading appointments...</p>}
        {error && <p className="appointments-error">{error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <div className="appointments-empty">
            <p>No upcoming appointments.</p>
            <button type="button" className="primary-btn" onClick={() => navigate("/bookappointment")}>
              Book an Appointment
            </button>
          </div>
        )}

        <div className="appointments-list">
          {appointments.map((item) => {
            const attrs = item.attributes || {};
            const coach = attrs.coach_details || {};
            const canConnect = isWithinWindow(attrs.viewable_slot);
            const connecting = connectingId === item.id;
            return (
              <div key={item.id} className="appointment-card">
                <div className="appointment-info">
                  <h3>{coach.full_name || "Coach"}</h3>
                  <p className="slot-time">{attrs.viewable_slot || `${attrs.start_time} - ${attrs.end_time}`}</p>
                  {Array.isArray(coach.expertise) && coach.expertise.length > 0 && (
                    <p className="slot-meta">
                      {coach.expertise
                        .map((e) => (typeof e === "string" ? e : e?.specialization || e?.expertise || ""))
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={`connect-btn ${canConnect ? "enabled" : "disabled"}`}
                  disabled={!canConnect || connecting}
                  onClick={() => startCall(item)}
                >
                  {connecting ? "Connecting..." : "Connect Now"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MyAppointments;
