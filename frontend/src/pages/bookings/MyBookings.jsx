import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading bookings...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {bookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            showAdminActions={false}
            showUserInfo={false}
          />
        ))}
      </div>
      
      {bookings.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          You don't have any bookings yet.
        </div>
      )}
    </div>
  );
};

export default MyBookings;