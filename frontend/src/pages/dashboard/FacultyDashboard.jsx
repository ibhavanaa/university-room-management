import React from "react";
import { Link } from "react-router-dom";

function FacultyDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Faculty Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/rooms"
          className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200"
        >
          🏫 Check Room Availability
        </Link>
        <Link
          to="/bookings/my"
          className="p-4 bg-green-100 rounded-lg shadow hover:bg-green-200"
        >
          📅 My Bookings
        </Link>
        <Link
          to="/maintenance/my"
          className="p-4 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200"
        >
          🛠 Maintenance Requests
        </Link>
        <Link
          to="/alerts"
          className="p-4 bg-red-100 rounded-lg shadow hover:bg-red-200"
        >
          🔔 Alerts
        </Link>
      </div>
    </div>
  );
}

export default FacultyDashboard;
