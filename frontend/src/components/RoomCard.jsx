// src/components/RoomCard.jsx
import React from 'react';

const RoomCard = ({ room, onBook, selectedDateTime }) => {
  const getStatusBadge = (room) => {
    if (room.error) {
      return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Error</span>;
    }
    
    if (room.available) {
      return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Available</span>;
    } else {
      return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Unavailable</span>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{room.name}</h3>
          {getStatusBadge(room)}
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <p><span className="font-medium">Building:</span> {room.building}</p>
          <p><span className="font-medium">Department:</span> {room.department}</p>
          <p><span className="font-medium">Capacity:</span> {room.capacity} people</p>
        </div>
        
        {!room.available && room.conflictingBooking && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3">
            <p className="text-sm text-yellow-700">
              Conflict with: {room.conflictingBooking.purpose} by {room.conflictingBooking.userEmail}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={onBook}
            disabled={!room.available}
            className={`px-3 py-1 rounded text-sm ${
              room.available 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Book Room
          </button>
          
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;