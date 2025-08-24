// src/components/maintenance/MaintenanceCard.jsx
import React from 'react';
import { formatDate } from '../../utils/helpers';
import { MAINTENANCE_STATUS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const MaintenanceCard = ({ request, onStatusUpdate }) => {
  const { currentUser } = useAuth();

  const getStatusClass = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.RESOLVED:
        return 'status-resolved';
      case MAINTENANCE_STATUS.IN_PROGRESS:
        return 'status-in-progress';
      case MAINTENANCE_STATUS.PENDING:
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return 'urgency-medium';
    }
  };

  return (
    <div className="maintenance-card card">
      <div className="maintenance-header">
        <h3>{request.room?.name} - {request.issueType}</h3>
        <div className="status-badges">
          <span className={`urgency-badge ${getUrgencyClass(request.urgency)}`}>
            {request.urgency}
          </span>
          <span className={`status-badge ${getStatusClass(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>
      <div className="maintenance-details">
        <p><strong>Description:</strong> {request.description}</p>
        <p><strong>Submitted:</strong> {formatDate(request.createdAt)}</p>
        {request.user && (
          <p><strong>Reported by:</strong> {request.user.name}</p>
        )}
      </div>
      {currentUser.role === 'admin' && (
        <div className="maintenance-actions">
          {request.status === MAINTENANCE_STATUS.PENDING && (
            <button 
              className="btn btn-info btn-sm"
              onClick={() => onStatusUpdate(request._id, MAINTENANCE_STATUS.IN_PROGRESS)}
            >
              Start Work
            </button>
          )}
          {request.status === MAINTENANCE_STATUS.IN_PROGRESS && (
            <button 
              className="btn btn-success btn-sm"
              onClick={() => onStatusUpdate(request._id, MAINTENANCE_STATUS.RESOLVED)}
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MaintenanceCard;