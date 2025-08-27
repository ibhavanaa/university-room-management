import React, { useEffect, useState } from "react";
import bookingService from "../../services/bookingService";
import maintenanceService from "../../services/maintenanceService";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

function AnalyticsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    bookingService.getAllBookings().then(setBookings).catch(() => setBookings([]));
    maintenanceService.getAllRequests().then(setMaintenance).catch(() => setMaintenance([]));
  }, []);

  // Bookings per room
  const bookingsByRoom = bookings.reduce((acc, b) => {
    acc[b.roomName] = (acc[b.roomName] || 0) + 1;
    return acc;
  }, {});
  const bookingData = Object.entries(bookingsByRoom).map(([room, count]) => ({ room, count }));

  // Maintenance status
  const statusCount = maintenance.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCount).map(([status, value]) => ({ status, value }));

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bookings per Room */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Bookings per Room</h3>
          <BarChart width={400} height={300} data={bookingData}>
            <XAxis dataKey="room" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>

        {/* Maintenance Status */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Maintenance Requests</h3>
          <PieChart width={400} height={300}>
            <Pie data={statusData} dataKey="value" nameKey="status" outerRadius={120}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
