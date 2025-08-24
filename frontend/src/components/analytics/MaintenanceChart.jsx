// src/components/analytics/MaintenanceChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const MaintenanceChart = ({ data }) => {
  const chartData = {
    labels: ['Resolved', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [
          data.resolved || 0,
          data.inProgress || 0,
          data.pending || 0
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Request Status',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default MaintenanceChart;