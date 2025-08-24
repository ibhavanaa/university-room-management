// src/components/maintenance/MaintenanceForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const MaintenanceForm = ({ rooms, onRequestCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    issueType: '',
    description: '',
    urgency: 'medium'
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
      await api.post('/api/maintenance', formData);
      toast.success('Maintenance request submitted successfully');
      setFormData({
        roomId: '',
        issueType: '',
        description: '',
        urgency: 'medium'
      });
      onRequestCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Submit Maintenance Request</h3>
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
          <label className="form-label">Issue Type</label>
          <select
            name="issueType"
            className="form-input"
            value={formData.issueType}
            onChange={handleChange}
            required
          >
            <option value="">Select issue type</option>
            <option value="electrical">Electrical</option>
            <option value="furniture">Furniture</option>
            <option value="plumbing">Plumbing</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Please describe the issue in detail..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Urgency</label>
          <select
            name="urgency"
            className="form-input"
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
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

export default MaintenanceForm;