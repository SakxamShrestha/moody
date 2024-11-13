// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import History from "./components/History";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />{" "}
      <Route path="/history" element={<History />} />{" "}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/new-journal" element={<Journal />} />
    </Routes>
  );
}

export default App;
