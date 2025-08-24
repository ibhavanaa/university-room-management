// src/components/dashboard/FacultyDashboard.jsx
import React from 'react';

const FacultyDashboard = () => {
  return (
    <div className="dashboard-faculty">
      <h2>Faculty Dashboard</h2>
      <div className="grid grid-2">
        <div className="stat-card">
          <h3>My Bookings</h3>
          <p className="stat-number">8</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Classes</h3>
          <p className="stat-number">3</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;