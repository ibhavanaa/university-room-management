// src/pages/RoomManagement.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    department: '',
    capacity: '',
    equipment: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/rooms', formData);
      toast.success('Room added successfully');
      setShowForm(false);
      setFormData({
        name: '',
        building: '',
        department: '',
        capacity: '',
        equipment: ''
      });
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <div className="room-management">
      <div className="page-header flex-between">
        <h2>Room Management</h2>
        {currentUser.role === USER_ROLES.ADMIN && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Room'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Room</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Building</label>
              <input
                type="text"
                name="building"
                className="form-input"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                name="capacity"
                className="form-input"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Equipment</label>
              <input
                type="text"
                name="equipment"
                className="form-input"
                value={formData.equipment}
                onChange={handleChange}
                placeholder="Projector, Whiteboard, etc."
              />
            </div>
            <button type="submit" className="btn btn-success">
              Add Room
            </button>
          </form>
        </div>
      )}

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room._id} className="room-card card">
            <h3>{room.name}</h3>
            <p><strong>Building:</strong> {room.building}</p>
            <p><strong>Department:</strong> {room.department}</p>
            <p><strong>Capacity:</strong> {room.capacity} people</p>
            <p><strong>Equipment:</strong> {room.equipment || 'None'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;