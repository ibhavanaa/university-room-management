import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function AnalyticsPage() {
  const [stats, setStats] = useState({
    bookingsPerDept: [],
    requestsStatus: [],
  });

  useEffect(() => {
    // TODO: Replace with API call -> GET /api/analytics
    setStats({
      bookingsPerDept: [
        { dept: "CS", count: 20 },
        { dept: "EE", count: 15 },
        { dept: "ME", count: 10 },
      ],
      requestsStatus: [
        { status: "Pending", value: 5 },
        { status: "In Progress", value: 3 },
        { status: "Resolved", value: 7 },
      ],
    });
  }, []);

  const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444"];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Admin Analytics Dashboard</h2>

      {/* Bookings per Department */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Bookings per Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.bookingsPerDept}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dept" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Maintenance Requests Status */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Maintenance Requests Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.requestsStatus}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.requestsStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsPage;
