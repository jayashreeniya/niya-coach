import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "../login/myAppointments.css";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (token && role === "coach") {
      navigate("/coach-appointments", { replace: true });
    } else if (token && role) {
      navigate("/appointments", { replace: true });
    }
  }, [navigate]);

  const goBookAppointment = () => {
    const token = localStorage.getItem("accessToken");
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (token && role && role !== "coach") {
      navigate("/bookappointment");
      return;
    }
    // Booking is coachee-only — require login first
    navigate("/login", { state: { from: "/bookappointment" } });
  };

  return (
    <div className="home-page">
      <header className="appointments-header">
        <img
          src={Logo}
          alt="Niya"
          className="appointments-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <nav className="appointments-nav">
          <button type="button" className="nav-link" onClick={goBookAppointment}>
            Book Appointment
          </button>
          <button type="button" className="nav-link home-login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </nav>
      </header>

      <main className="home-landing">
        <div className="home-landing-hero">
          <img src={Logo} alt="" className="home-landing-mark" />
          <h1>Niya</h1>
          <p>Book a coaching session, or sign in to join your appointments and wellbeing tools.</p>
          <div className="home-landing-actions">
            <button type="button" className="primary-btn" onClick={goBookAppointment}>
              Book Appointment
            </button>
            <button type="button" className="refresh-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
