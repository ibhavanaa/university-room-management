// src/components/dashboard/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="dashboard-admin">
      <h2>Admin Dashboard</h2>
      <div className="grid grid-3">
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <p className="stat-number">25</p>
        </div>
        <div className="stat-card">
          <h3>Pending Bookings</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-card">
          <h3>Maintenance Requests</h3>
          <p className="stat-number">5</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;