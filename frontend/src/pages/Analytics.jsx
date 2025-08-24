// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState({
    roomUtilization: [],
    buildingBookings: [],
    maintenanceStats: {},
    bookingTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/analytics');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const buildingBookingsData = {
    labels: stats.buildingBookings.map(item => item._id),
    datasets: [
      {
        label: 'Number of Bookings',
        data: stats.buildingBookings.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const roomUtilizationData = {
    labels: stats.roomUtilization.map(item => item.roomName),
    datasets: [
      {
        label: 'Utilization Rate (%)',
        data: stats.roomUtilization.map(item => item.utilizationRate),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const maintenanceStatusData = {
    labels: ['Resolved', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [
          stats.maintenanceStats?.resolved || 0,
          stats.maintenanceStats?.inProgress || 0,
          stats.maintenanceStats?.pending || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics-page">
      <h2>Analytics Dashboard</h2>
      
      <div className="stats-grid grid grid-3">
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <p className="stat-number">{stats.roomUtilization.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.buildingBookings.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Maintenance Requests</h3>
          <p className="stat-number">
            {Object.values(stats.maintenanceStats).reduce((sum, count) => sum + count, 0)}
          </p>
        </div>
      </div>

      <div className="charts-grid grid grid-2">
        <div className="chart-card card">
          <h3>Bookings by Building</h3>
          <Bar 
            data={buildingBookingsData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>

        <div className="chart-card card">
          <h3>Room Utilization Rates</h3>
          <Bar 
            data={roomUtilizationData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }}
          />
        </div>

        <div className="chart-card card">
          <h3>Maintenance Request Status</h3>
          <Doughnut 
            data={maintenanceStatusData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>

        <div className="chart-card card">
          <h3>Weekly Statistics</h3>
          <div className="weekly-stats">
            <p><strong>Most Booked Room:</strong> {
              stats.roomUtilization.length > 0 
                ? stats.roomUtilization.reduce((prev, current) => 
                    (prev.utilizationRate > current.utilizationRate) ? prev : current
                  ).roomName
                : 'N/A'
            }</p>
            <p><strong>Average Utilization:</strong> {
              stats.roomUtilization.length > 0 
                ? (stats.roomUtilization.reduce((sum, room) => sum + room.utilizationRate, 0) / 
                   stats.roomUtilization.length).toFixed(1) + '%'
                : 'N/A'
            }</p>
            <p><strong>Resolution Rate:</strong> {
              Object.values(stats.maintenanceStats).reduce((sum, count) => sum + count, 0) > 0
                ? ((stats.maintenanceStats.resolved || 0) / 
                   Object.values(stats.maintenanceStats).reduce((sum, count) => sum + count, 0) * 100).toFixed(1) + '%'
                : 'N/A'
            }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;