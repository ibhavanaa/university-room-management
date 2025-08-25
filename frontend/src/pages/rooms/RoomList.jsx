import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, checkAvailability } from "../../services/roomService";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async (roomId, roomName) => {
    setChecking(true);
    try {
      const response = await checkAvailability({
        roomId: roomId,
        date: selectedDate,
        time: selectedTime
      });

      setAvailabilityResult({
        roomId: roomId,
        roomName: roomName,
        data: response.data,
        timestamp: new Date().toLocaleTimeString()
      });

    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Error checking availability. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  // NEW FUNCTION: Handle room booking
  const handleBookRoom = (roomId, roomName) => {
    navigate('/bookings/create', { 
      state: { 
        roomId: roomId,
        roomName: roomName,
        date: selectedDate,
        time: selectedTime
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading rooms...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Rooms & Labs</h2>

      {/* Date and Time Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Check Availability For</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time (24-hour format)
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Current selection: {selectedDate} at {selectedTime}
        </p>
      </div>

      {/* Availability Result */}
      {availabilityResult && (
        <div className={`mb-6 p-6 rounded-lg border ${
          availabilityResult.data.available 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {availabilityResult.roomName} -{" "}
                {availabilityResult.data.available ? "Available" : "Not Available"}
              </h3>
              <p className="text-sm mt-1">
                Checked at {availabilityResult.timestamp}
              </p>
              {!availabilityResult.data.available && availabilityResult.data.conflict && (
                <div className="mt-2">
                  <p className="font-medium">Conflict Details:</p>
                  <p className="text-sm">{availabilityResult.data.conflict.reason}</p>
                </div>
              )}
            </div>
            {availabilityResult.data.available && (
              <button 
                onClick={() => handleBookRoom(availabilityResult.roomId, availabilityResult.roomName)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map(room => (
          <div key={room._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p className="flex items-center">
                <span className="font-medium">Building:</span>
                <span className="ml-2">{room.building}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium">Department:</span>
                <span className="ml-2">{room.department}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium">Capacity:</span>
                <span className="ml-2">{room.capacity} people</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  room.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.status}
                </span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleCheckAvailability(room._id, room.name)}
                disabled={checking}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                {checking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Checking...
                  </>
                ) : (
                  "Check Availability"
                )}
              </button>
              
              <button 
                onClick={() => handleBookRoom(room._id, room.name)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Book Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;