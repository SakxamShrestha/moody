// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import History from "./components/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />{" "}
      <Route path="/history" element={<History />} />{" "}
    </Routes>
  );
}

export default App;
