// src/pages/Maintenance.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, MAINTENANCE_STATUS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    issueType: '',
    description: '',
    urgency: 'medium'
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchRequests = useCallback(async () => {
    try {
      const endpoint = currentUser.role === USER_ROLES.ADMIN 
        ? '/api/maintenance' 
        : '/api/maintenance/my';
      const response = await api.get(endpoint);
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch maintenance requests');
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
    fetchRequests();
    fetchRooms();
  }, [fetchRequests, fetchRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/maintenance', formData);
      toast.success('Maintenance request submitted successfully');
      setShowForm(false);
      setFormData({
        roomId: '',
        issueType: '',
        description: '',
        urgency: 'medium'
      });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await api.patch(`/api/maintenance/${requestId}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading maintenance requests...</div>;

  return (
    <div className="maintenance-page">
      <div className="page-header flex-between">
        <h2>Maintenance Requests</h2>
        {currentUser.role !== USER_ROLES.ADMIN && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'New Request'}
          </button>
        )}
      </div>

      {showForm && (
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
                rows="3"
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
            <button type="submit" className="btn btn-success">
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className="requests-list">
        {requests.map(request => (
          <div key={request._id} className="request-card card">
            <div className="flex-between">
              <div>
                <h3>{request.room?.name} - {request.issueType}</h3>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Urgency:</strong> 
                  <span className={`urgency-${request.urgency}`}>
                    {request.urgency}
                  </span>
                </p>
                <p><strong>Status:</strong> 
                  <span className={`status-${request.status}`}>
                    {request.status}
                  </span>
                </p>
                <p><strong>Submitted:</strong> {formatDate(request.createdAt)}</p>
                {request.user && (
                  <p><strong>Reported by:</strong> {request.user.name}</p>
                )}
              </div>
              {currentUser.role === USER_ROLES.ADMIN && (
                <div className="request-actions">
                  {request.status === MAINTENANCE_STATUS.PENDING && (
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => handleStatusUpdate(request._id, MAINTENANCE_STATUS.IN_PROGRESS)}
                    >
                      Start Work
                    </button>
                  )}
                  {request.status === MAINTENANCE_STATUS.IN_PROGRESS && (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusUpdate(request._id, MAINTENANCE_STATUS.RESOLVED)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;