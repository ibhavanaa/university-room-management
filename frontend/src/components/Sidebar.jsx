import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building,
  Bell,
  Calendar,
  Wrench,
  BarChart3,
  Users,
  Upload,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  LogOut
} from "lucide-react";
import useAuth from "../hooks/useAuth";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-slate-800 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">University Infra Management</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm text-slate-300">Welcome</p>
        <p className="font-medium truncate">{user?.email}</p>
        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {/* Dashboard Link */}
          <Link
            to={`/dashboard/${user?.role}`}
            className={`flex items-center px-3 py-2 rounded-lg transition ${
              location.pathname.startsWith('/dashboard') 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </Link>

          {/* Common Items for All Roles */}
          <Link
            to="/rooms"
            className={`flex items-center px-3 py-2 rounded-lg transition ${
              isActive('/rooms') 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building size={18} className="mr-3" />
            Rooms
          </Link>

          <Link
            to="/alerts"
            className={`flex items-center px-3 py-2 rounded-lg transition ${
              isActive('/alerts') 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bell size={18} className="mr-3" />
            Alerts
          </Link>

          {/* Student-Specific Items */}
          {user?.role === 'student' && (
            <>
              <Link
                to="/bookings/my"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/bookings/my') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calendar size={18} className="mr-3" />
                My Bookings
              </Link>

              <Link
                to="/maintenance/my"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/maintenance/my') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Wrench size={18} className="mr-3" />
                My Requests
              </Link>
            </>
          )}

          {/* Admin-Specific Items */}
          {user?.role === 'admin' && (
            <>
              <Link
                to="/bookings/manage"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/bookings/manage') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ClipboardList size={18} className="mr-3" />
                Manage Bookings
              </Link>

              <Link
                to="/maintenance/manage"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/maintenance/manage') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Wrench size={18} className="mr-3" />
                Manage Maintenance
              </Link>

              <Link
                to="/alerts/create"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/alerts/create') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <AlertTriangle size={18} className="mr-3" />
                Create Alert
              </Link>

              <Link
                to="/timetable/upload"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/timetable/upload') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Upload size={18} className="mr-3" />
                Upload Timetable
              </Link>

              <Link
                to="/calendar"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/calendar') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calendar size={18} className="mr-3" />
                Room Calendar
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/analytics') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <BarChart3 size={18} className="mr-3" />
                Analytics
              </Link>

              <Link
                to="/users/manage"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/users/manage') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Users size={18} className="mr-3" />
                User Management
              </Link>
            </>
          )}

          {/* Faculty-Specific Items (if needed) */}
          {user?.role === 'faculty' && (
            <>
              <Link
                to="/bookings/my"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/bookings/my') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calendar size={18} className="mr-3" />
                My Bookings
              </Link>

              <Link
                to="/maintenance/my"
                className={`flex items-center px-3 py-2 rounded-lg transition ${
                  isActive('/maintenance/my') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Wrench size={18} className="mr-3" />
                My Requests
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;