// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const getDashboardContent = () => {
    switch (currentUser.role) {
      case USER_ROLES.ADMIN:
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
      
      case USER_ROLES.FACULTY:
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
      
      case USER_ROLES.STUDENT:
      default:
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
    }
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome, {currentUser.name}!</h1>
        <p>Role: {currentUser.role.toUpperCase()}</p>
      </div>
      {getDashboardContent()}
    </div>
  );
};

export default Dashboard;