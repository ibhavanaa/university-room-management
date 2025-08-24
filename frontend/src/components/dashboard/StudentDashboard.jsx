// src/components/dashboard/StudentDashboard.jsx
import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="dashboard-student">
      <h2>Student Dashboard</h2>
      <div className="grid grid-2">
        <div className="stat-card">
          <h3>My Bookings</h3>
          <p className="stat-number">4</p>
        </div>
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p className="stat-number">15</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;