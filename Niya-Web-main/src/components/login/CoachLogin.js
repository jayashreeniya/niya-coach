import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/images/niyalogo.png";
import "./login.css";

const API_BASE = "https://niya-backend-oiut.onrender.com";

const CoachLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Incorrect email or password.");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (token && role === "coach") {
      navigate("/coach-appointments", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError(false);
    setLoading(true);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter email and password.");
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/bx_block_login/logins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            type: "email_account",
            attributes: {
              email: email.trim(),
              password,
            },
          },
        }),
      });

      if (!res.ok) {
        setErrorMessage("Incorrect email or password.");
        setShowError(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const accessToken = data?.meta?.token;
      if (!accessToken) {
        setErrorMessage("Incorrect email or password.");
        setShowError(true);
        setLoading(false);
        return;
      }

      const role = (data.meta.role || "").toLowerCase();
      if (role !== "coach") {
        setErrorMessage("This portal is for coaches only. Please use the coachee login.");
        setShowError(true);
        setLoading(false);
        return;
      }

      localStorage.setItem("authenticated", "true");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userRole", role);
      if (data.meta.id) localStorage.setItem("userId", String(data.meta.id));
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("userRole", role);
      if (data.meta.id) sessionStorage.setItem("userId", String(data.meta.id));

      setLoading(false);
      navigate("/coach-appointments", { replace: true });
    } catch (_) {
      setErrorMessage("Could not sign in. Please try again.");
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <div className="sign-in__wrapper">
      <div className="sign-in__backdrop" />
      <Form className="shadow p-4 bg-white rounded main login-page" onSubmit={handleSubmit}>
        <img className="img-thumbnail mx-auto d-block" src={Logo} alt="Niya" />
        <div className="h4 text-center">Coach Login</div>
        <p className="text-center" style={{ fontSize: 14, color: "#64748b", marginTop: -4 }}>
          Sign in to view appointments and start video calls.
        </p>

        {showError ? (
          <Alert onClose={() => setShowError(false)} dismissible>
            {errorMessage}
          </Alert>
        ) : null}

        <Form.Group controlId="coach-email">
          <Form.Label className="Label">Email:</Form.Label>
          <Form.Control
            className="mb-2"
            type="email"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </Form.Group>
        <Form.Group controlId="coach-password">
          <Form.Label className="Label">Password:</Form.Label>
          <Form.Control
            className="mb-2"
            type="password"
            value={password}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>

        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 14 }}>
          <Link to="/login" style={{ color: "#334155", textDecoration: "underline" }}>
            Coachee login
          </Link>
          <span style={{ margin: "0 8px", color: "#94a3b8" }}>|</span>
          <Link to="/" style={{ color: "#334155", textDecoration: "underline" }}>
            Home
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default CoachLogin;
