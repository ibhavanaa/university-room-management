// src/components/alerts/AlertCard.jsx
import React from 'react';
import { formatDate } from '../../utils/helpers';

const AlertCard = ({ alert }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'priority-emergency';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className={`alert-card card ${getPriorityClass(alert.priority)}`}>
      <div className="alert-header">
        <h3>{alert.title}</h3>
        <span className={`priority-badge ${getPriorityClass(alert.priority)}`}>
          {alert.priority}
        </span>
      </div>
      <p className="alert-message">{alert.message}</p>
      <div className="alert-meta">
        <span>Posted by: {alert.createdBy?.name || 'Admin'}</span>
        <span>Date: {formatDate(alert.createdAt)}</span>
      </div>
    </div>
  );
};

export default AlertCard;