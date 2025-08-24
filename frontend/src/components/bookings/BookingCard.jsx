// src/components/bookings/BookingCard.jsx
import React from 'react';
import { formatDate } from '../../utils/helpers';
import { BOOKING_STATUS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const BookingCard = ({ booking, onStatusUpdate }) => {
  const { currentUser } = useAuth();

  const getStatusClass = (status) => {
    switch (status) {
      case BOOKING_STATUS.APPROVED:
        return 'status-approved';
      case BOOKING_STATUS.PENDING:
        return 'status-pending';
      case BOOKING_STATUS.DECLINED:
        return 'status-declined';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="booking-card card">
      <div className="booking-header">
        <h3>{booking.room?.name}</h3>
        <span className={`status-badge ${getStatusClass(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className="booking-details">
        <p><strong>Date:</strong> {formatDate(booking.date)}</p>
        <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
        <p><strong>Purpose:</strong> {booking.purpose}</p>
        {booking.user && (
          <p><strong>Booked by:</strong> {booking.user.name}</p>
        )}
      </div>
      {currentUser.role === 'admin' && booking.status === BOOKING_STATUS.PENDING && (
        <div className="booking-actions">
          <button 
            className="btn btn-success btn-sm"
            onClick={() => onStatusUpdate(booking._id, BOOKING_STATUS.APPROVED)}
          >
            Approve
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onStatusUpdate(booking._id, BOOKING_STATUS.DECLINED)}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;