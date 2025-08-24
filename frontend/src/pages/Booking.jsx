// src/pages/Booking.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, BOOKING_STATUS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchBookings = useCallback(async () => {
    try {
      const endpoint = currentUser.role === USER_ROLES.ADMIN 
        ? '/api/bookings' 
        : '/api/bookings/my';
      const response = await api.get(endpoint);
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [currentUser.role]);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await api.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [fetchBookings, fetchRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/bookings', formData);
      toast.success('Booking request submitted successfully');
      setShowBookingForm(false);
      setFormData({
        roomId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
      });
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.patch(`/api/bookings/${bookingId}`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="booking-page">
      <div className="page-header flex-between">
        <h2>{currentUser.role === USER_ROLES.ADMIN ? 'All Bookings' : 'My Bookings'}</h2>
        {currentUser.role !== USER_ROLES.ADMIN && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowBookingForm(!showBookingForm)}
          >
            {showBookingForm ? 'Cancel' : 'New Booking'}
          </button>
        )}
      </div>

      {showBookingForm && (
        <div className="card">
          <h3>Create New Booking</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room</label>
              <select
                name="roomId"
                className="form-input"
                value={formData.roomId}
                onChange={handleChange}
                required
              >
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room._id} value={room._id}>
                    {room.name} - {room.building}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Purpose</label>
              <textarea
                name="purpose"
                className="form-input"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Request Booking
            </button>
          </form>
        </div>
      )}

      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking._id} className="booking-card card">
            <div className="flex-between">
              <div>
                <h3>{booking.room?.name}</h3>
                <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                <p><strong>Purpose:</strong> {booking.purpose}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-${booking.status}`}>
                    {booking.status}
                  </span>
                </p>
                {booking.user && (
                  <p><strong>Booked by:</strong> {booking.user.name}</p>
                )}
              </div>
              {currentUser.role === USER_ROLES.ADMIN && booking.status === BOOKING_STATUS.PENDING && (
                <div className="booking-actions">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusUpdate(booking._id, BOOKING_STATUS.APPROVED)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate(booking._id, BOOKING_STATUS.DECLINED)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;