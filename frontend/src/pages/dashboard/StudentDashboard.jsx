import React from "react";
import { Link } from "react-router-dom";
import { Building, Calendar, Wrench, Bell, BookOpen } from "lucide-react";

function StudentDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/rooms"
          className="p-6 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition duration-200 flex flex-col items-center text-center group"
        >
          <div className="p-3 bg-blue-200 rounded-full mb-4 group-hover:bg-blue-300 transition">
            <Building className="text-blue-700" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Room Availability</h3>
          <p className="text-sm text-gray-600">Check available rooms and labs</p>
        </Link>

        <Link
          to="/bookings/my"
          className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition duration-200 flex flex-col items-center text-center group"
        >
          <div className="p-3 bg-green-200 rounded-full mb-4 group-hover:bg-green-300 transition">
            <Calendar className="text-green-700" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">My Bookings</h3>
          <p className="text-sm text-gray-600">View and manage your bookings</p>
        </Link>

        <Link
          to="/maintenance/my"
          className="p-6 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200 transition duration-200 flex flex-col items-center text-center group"
        >
          <div className="p-3 bg-yellow-200 rounded-full mb-4 group-hover:bg-yellow-300 transition">
            <Wrench className="text-yellow-700" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Maintenance Requests</h3>
          <p className="text-sm text-gray-600">Report and track issues</p>
        </Link>

        <Link
          to="/alerts"
          className="p-6 bg-red-100 rounded-lg shadow hover:bg-red-200 transition duration-200 flex flex-col items-center text-center group"
        >
          <div className="p-3 bg-red-200 rounded-full mb-4 group-hover:bg-red-300 transition">
            <Bell className="text-red-700" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Emergency Alerts</h3>
          <p className="text-sm text-gray-600">View important notifications</p>
        </Link>

        <Link
          to="/rooms"
          className="p-6 bg-purple-100 rounded-lg shadow hover:bg-purple-200 transition duration-200 flex flex-col items-center text-center group"
        >
          <div className="p-3 bg-purple-200 rounded-full mb-4 group-hover:bg-purple-300 transition">
            <BookOpen className="text-purple-700" size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Room Booking</h3>
          <p className="text-sm text-gray-600">Book rooms for study sessions</p>
        </Link>
      </div>

      {/* Quick Stats or Notifications Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-600">Active Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">1</p>
            <p className="text-sm text-gray-600">New Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;