// src/components/rooms/RoomForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const RoomForm = ({ onRoomAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    department: '',
    capacity: '',
    equipment: ''
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
      await api.post('/api/rooms', formData);
      toast.success('Room added successfully');
      setFormData({
        name: '',
        building: '',
        department: '',
        capacity: '',
        equipment: ''
      });
      onRoomAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Room'}
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

export default RoomForm;