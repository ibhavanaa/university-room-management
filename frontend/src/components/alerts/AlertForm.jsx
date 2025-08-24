// src/components/alerts/AlertForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AlertForm = ({ onAlertCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium'
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
      await api.post('/api/alerts', formData);
      toast.success('Alert created successfully');
      setFormData({
        title: '',
        message: '',
        priority: 'medium'
      });
      onAlertCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Create New Alert</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea
            name="message"
            className="form-input"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Important information for all users..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-input"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Broadcast Alert'}
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

export default AlertForm;