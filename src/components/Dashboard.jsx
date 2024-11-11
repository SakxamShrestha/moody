import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <p>dashboard</p>
      <Link to="/history">history</Link>
    </div>
  );
}

export default Dashboard;
