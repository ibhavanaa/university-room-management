// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            Classroom Management System
          </Link>

          <button 
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-item">
                  Dashboard
                </Link>
                
                <Link to="/rooms" className="navbar-item">
                  Rooms
                </Link>
                
                <Link to="/bookings" className="navbar-item">
                  Bookings
                </Link>
                
                <Link to="/maintenance" className="navbar-item">
                  Maintenance
                </Link>
                
                <Link to="/alerts" className="navbar-item">
                  Alerts
                </Link>
                
                {currentUser.role === USER_ROLES.ADMIN && (
                  <Link to="/analytics" className="navbar-item">
                    Analytics
                  </Link>
                )}

                <div className="navbar-user">
                  <span className="navbar-user-name">
                    {currentUser.name} ({currentUser.role})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-item">
                  Login
                </Link>
                <Link to="/register" className="navbar-item">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;