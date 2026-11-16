import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/login/Home";
import CoachLogin from "./components/login/CoachLogin";
import Wellbeing from "./components/login/Wellbeing";
import Bookappointment from "./components/login/Bookappointment";
import PaymentSuccess from "./components/login/PaymentSuccess";
import MyAppointments from "./components/login/MyAppointments";
import CoachAppointments from "./components/login/CoachAppointments";
import VideoCall from "./components/login/VideoCall";
import Feedback from "./components/login/Feedback";
import WellbeingCategoriesPage from "./components/wellbeing/WellbeingCategoriesPage";
import WellbeingQuestionsPage from "./components/wellbeing/WellbeingQuestionsPage";
import WellbeingResultsPage from "./components/wellbeing/WellbeingResultsPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/coach-login" element={<CoachLogin />} />
        <Route path="/coach" element={<CoachLogin />} />
        <Route path="/wellbeingquestions" element={<Wellbeing />} />
        <Route path="/wellbeing-assessment" element={<WellbeingCategoriesPage />} />
        <Route path="/wellbeing-assessment/:categoryId" element={<WellbeingQuestionsPage />} />
        <Route path="/wellbeing-results" element={<WellbeingResultsPage />} />
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
