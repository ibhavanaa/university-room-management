import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/rooms"
          className="p-6 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">🏢</div>
          <h3 className="font-semibold">Manage Rooms & Labs</h3>
          <p className="text-sm text-gray-600 mt-2">Add, edit, or remove rooms</p>
        </Link>

        <Link
          to="/bookings/manage"
          className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold">Manage Bookings</h3>
          <p className="text-sm text-gray-600 mt-2">Approve or decline booking requests</p>
        </Link>

        <Link
          to="/maintenance/manage"
          className="p-6 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">🛠️</div>
          <h3 className="font-semibold">Manage Maintenance</h3>
          <p className="text-sm text-gray-600 mt-2">Handle maintenance requests</p>
        </Link>

        <Link
          to="/alerts/create"
          className="p-6 bg-red-100 rounded-lg shadow hover:bg-red-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">🚨</div>
          <h3 className="font-semibold">Send Alerts</h3>
          <p className="text-sm text-gray-600 mt-2">Create emergency notifications</p>
        </Link>

        <Link
          to="/analytics"
          className="p-6 bg-purple-100 rounded-lg shadow hover:bg-purple-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-gray-600 mt-2">View usage statistics</p>
        </Link>

        <Link
          to="/timetable/upload"
          className="p-6 bg-orange-100 rounded-lg shadow hover:bg-orange-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-semibold">Upload Timetable</h3>
          <p className="text-sm text-gray-600 mt-2">Upload Excel timetables</p>
        </Link>

        <Link
          to="/calendar"
          className="p-6 bg-pink-100 rounded-lg shadow hover:bg-pink-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">🗓️</div>
          <h3 className="font-semibold">Room Calendar</h3>
          <p className="text-sm text-gray-600 mt-2">View room schedules</p>
        </Link>

        <Link
          to="/users/manage"
          className="p-6 bg-indigo-100 rounded-lg shadow hover:bg-indigo-200 transition duration-200 flex flex-col items-center text-center"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-gray-600 mt-2">Manage user accounts</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;