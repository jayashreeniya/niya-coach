import React, { } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Wellbeing from "./components/login/Wellbeing";
import Bookappointment from "./components/login/Bookappointment";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/wellbeingquestions" element={<Wellbeing />} />
        <Route path="/bookappointment" element={<Bookappointment />} />
      </Routes>
    </div>
  
  );
}

export default App;
