// src/components/bookings/BookingForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const BookingForm = ({ rooms, onBookingCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/bookings', formData);
      toast.success('Booking request submitted successfully');
      setFormData({
        roomId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: ''
      });
      onBookingCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Request Booking'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;