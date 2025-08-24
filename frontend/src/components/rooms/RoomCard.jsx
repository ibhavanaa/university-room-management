// src/components/rooms/RoomCard.jsx
import React from 'react';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card card">
      <h3>{room.name}</h3>
      <p><strong>Building:</strong> {room.building}</p>
      <p><strong>Department:</strong> {room.department}</p>
      <p><strong>Capacity:</strong> {room.capacity} people</p>
      <p><strong>Equipment:</strong> {room.equipment || 'None'}</p>
      <div className="room-actions">
        <button className="btn btn-primary btn-sm">
          View Details
        </button>
        <button className="btn btn-success btn-sm">
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default RoomCard;