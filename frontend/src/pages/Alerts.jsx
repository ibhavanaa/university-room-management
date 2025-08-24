// src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      toast.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/alerts', formData);
      toast.success('Alert created successfully');
      setShowForm(false);
      setFormData({
        title: '',
        message: '',
        priority: 'medium'
      });
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create alert');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div className="alerts-page">
      <div className="page-header flex-between">
        <h2>Emergency Alerts & Notifications</h2>
        {currentUser.role === USER_ROLES.ADMIN && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'New Alert'}
          </button>
        )}
      </div>

      {showForm && (
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
                rows="3"
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
            <button type="submit" className="btn btn-success">
              Broadcast Alert
            </button>
          </form>
        </div>
      )}

      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert._id} className={`alert-card card priority-${alert.priority}`}>
            <h3>{alert.title}</h3>
            <p>{alert.message}</p>
            <div className="alert-meta">
              <span className={`priority-badge priority-${alert.priority}`}>
                {alert.priority}
              </span>
              <span>Posted by: {alert.createdBy?.name || 'Admin'}</span>
              <span>Date: {formatDate(alert.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;