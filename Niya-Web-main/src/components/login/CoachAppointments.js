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
  // Match app behavior: allow connect until 5 minutes after end time
  const graceEnd = new Date(window.end.getTime() + 5 * 60 * 1000);
  return now >= window.start && now <= graceEnd;
}

const CoachAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());
  const [connectingId, setConnectingId] = useState(null);

  const token = localStorage.getItem("accessToken");

  const loadUpcoming = useCallback(async () => {
    const res = await fetch(`${API_BASE}/bx_block_calendar/booked_slots/coach_upcoming_appointments`, {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.errors?.[0] || data?.message || "Failed to load upcoming appointments");
    }
    return Array.isArray(data?.data) ? data.data : [];
  }, [token]);

  const loadPast = useCallback(async () => {
    const res = await fetch(`${API_BASE}/bx_block_calendar/booked_slots/coach_past_appointments`, {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.errors?.[0] || data?.message || "Failed to load past appointments");
    }
    return Array.isArray(data?.data) ? data.data : [];
  }, [token]);

  const loadAppointments = useCallback(async () => {
    if (!token) {
      navigate("/");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [upcoming, past] = await Promise.all([loadUpcoming(), loadPast()]);
      setAppointments(upcoming);
      setPastAppointments(past);
    } catch (e) {
      setError(typeof e.message === "string" ? e.message : "Could not load appointments.");
      setAppointments([]);
      setPastAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [token, navigate, loadUpcoming, loadPast]);

  useEffect(() => {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role && role !== "coach") {
      navigate("/appointments");
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
    const slotId = item.id;
    const meetingCode = item?.attributes?.appointments?.meeting_code || "";
    setConnectingId(slotId);
    try {
      const res = await fetch(
        `${API_BASE}/bx_block_calendar/booked_slots/video_call?booked_slot_id=${slotId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", token },
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
          role: "coach",
        },
      });
    } catch (e) {
      alert(typeof e.message === "string" ? e.message : "Failed to start video call");
    } finally {
      setConnectingId(null);
    }
  };

  void nowTick;
  const list = activeTab === "upcoming" ? appointments : pastAppointments;

  return (
    <div className="appointments-page">
      <header className="appointments-header">
        <img src={Logo} alt="Niya" className="appointments-logo" />
        <nav className="appointments-nav">
          <button type="button" className="nav-link active" onClick={() => navigate("/coach-appointments")}>
            Coach Dashboard
          </button>
          <button type="button" className="nav-link" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="appointments-main">
        <div className="appointments-title-row">
          <div>
            <h1>Coach Appointments</h1>
            <p>Make a call during the booked time to join your coachee.</p>
          </div>
          <button type="button" className="refresh-btn" onClick={loadAppointments} disabled={loading}>
            Refresh
          </button>
        </div>

        <div className="appointments-nav" style={{ marginBottom: 20 }}>
          <button
            type="button"
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={`nav-link ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>

        {loading && <p className="appointments-status">Loading appointments...</p>}
        {error && <p className="appointments-error">{error}</p>}

        {!loading && !error && list.length === 0 && (
          <div className="appointments-empty">
            <p>No {activeTab} appointments.</p>
          </div>
        )}

        <div className="appointments-list">
          {list.map((item) => {
            const appt = item?.attributes?.appointments || {};
            const canConnect = activeTab === "upcoming" && isWithinWindow(appt.viewable_slots);
            const connecting = connectingId === item.id;
            return (
              <div key={item.id} className="appointment-card">
                <div className="appointment-info">
                  <h3>{appt.name || "Coachee"}</h3>
                  <p className="slot-time">{appt.viewable_slots || appt.booking_date}</p>
                  {appt.booking_date && <p className="slot-meta">Date: {appt.booking_date}</p>}
                </div>
                {activeTab === "upcoming" && (
                  <button
                    type="button"
                    className={`connect-btn ${canConnect ? "enabled" : "disabled"}`}
                    disabled={!canConnect || connecting}
                    onClick={() => startCall(item)}
                  >
                    {connecting ? "Connecting..." : "Make a Call"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CoachAppointments;
