import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import NewJournal from "./components/NewJournal";
import JournalHistory from "./components/JournalHistory";
import AvatarSelection from './components/AvatarSelection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/new-journal" element={<NewJournal />} />
      <Route path="/journal-history" element={<JournalHistory />} />
      <Route path="/avatar-selection" element={<AvatarSelection />} />
    </Routes>
  );
}

export default App;
