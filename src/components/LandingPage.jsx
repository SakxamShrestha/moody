// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <p className="bg-red-500">This is homepage.</p>
      <Link to="/history">This Link goes to History</Link>
    </div>
  );
}

export default LandingPage;
