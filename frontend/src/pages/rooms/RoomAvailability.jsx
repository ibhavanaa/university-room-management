// src/pages/rooms/RoomAvailability.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import RoomCard from '../../components/RoomCard';

const RoomAvailability = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms();
      setRooms(response.data);
      setFilteredRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Convert date and time to a format the backend expects
      const dateTime = `${date}T${time}:00.000Z`;
      
      // For each room, check if it's available at the selected time
      const availabilityPromises = rooms.map(async (room) => {
        try {
          const response = await roomService.checkRoomAvailability(room._id, dateTime);
          return {
            ...room,
            available: response.data.available,
            conflictingBooking: response.data.conflictingBooking
          };
        } catch (err) {
          console.error(`Error checking availability for room ${room.name}:`, err);
          return {
            ...room,
            available: false,
            error: 'Error checking availability'
          };
        }
      });
      
      const roomsWithAvailability = await Promise.all(availabilityPromises);
      setFilteredRooms(roomsWithAvailability);
      setSuccess('Availability checked successfully');
    } catch (err) {
      setError('Failed to check availability');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (roomId) => {
    try {
      setError('');
      setSuccess('');
      
      // Create booking data
      const bookingData = {
        room: roomId,
        date: date,
        startTime: time,
        endTime: calculateEndTime(time, 1), // Default to 1 hour booking
        purpose: 'Study Session'
      };
      
      const response = await bookingService.createBooking(bookingData);
      
      if (response.status === 201) {
        setSuccess('Room booked successfully!');
        // Refresh availability
        checkAvailability();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book room');
      console.error(err);
    }
  };

  const calculateEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + durationHours;
    
    // Handle overflow past 24 hours
    if (endHours >= 24) {
      endHours -= 24;
    }
    
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Room Availability</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Check Availability For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time (24-hour format)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <button
          onClick={checkAvailability}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
        
        <div className="mt-2 text-sm text-gray-500">
          Current selection: {date} at {time}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <RoomCard
            key={room._id}
            room={room}
            onBook={() => handleBookRoom(room._id)}
            selectedDateTime={{ date, time }}
          />
        ))}
      </div>
      
      {filteredRooms.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No rooms found. Try adjusting your filters.
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading rooms...</p>
        </div>
      )}
    </div>
  );
};

export default RoomAvailability;