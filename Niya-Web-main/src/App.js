import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Wellbeing from "./components/login/Wellbeing";
import Bookappointment from "./components/login/Bookappointment";
import PaymentSuccess from "./components/login/PaymentSuccess";
import MyAppointments from "./components/login/MyAppointments";
import CoachAppointments from "./components/login/CoachAppointments";
import VideoCall from "./components/login/VideoCall";
import Feedback from "./components/login/Feedback";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/wellbeingquestions" element={<Wellbeing />} />
        <Route path="/bookappointment" element={<Bookappointment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/coach-appointments" element={<CoachAppointments />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
