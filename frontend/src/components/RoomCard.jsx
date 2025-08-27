import React from "react";
import { MapPin, Users, Calendar, Edit3, Trash2 } from "lucide-react";

const RoomCard = ({ 
  room, 
  onEdit, 
  onDelete, 
  onBook, 
  showAdminActions = false,
  showBookButton = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
          {showAdminActions && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(room)}
                className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
                aria-label="Edit room"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => onDelete(room._id)}
                className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
                aria-label="Delete room"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Building: {room.building}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>Capacity: {room.capacity} people</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="w-5 h-5 mr-2">🏢</span>
            <span>Department: {room.department}</span>
          </div>
          
          {room.facilities && room.facilities.length > 0 && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Facilities:</h4>
              <div className="flex flex-wrap gap-1">
                {room.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {showBookButton && (
          <button
            onClick={() => onBook(room)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book This Room
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;