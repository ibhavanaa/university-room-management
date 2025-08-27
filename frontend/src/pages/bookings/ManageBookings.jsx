import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Refresh the bookings list
      fetchAllBookings();
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking:', err);
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
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {bookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onStatusUpdate={handleStatusUpdate}
            showAdminActions={true}
            showUserInfo={true}
          />
        ))}
      </div>
      
      {bookings.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No bookings found.
        </div>
      )}
    </div>
  );
};

export default ManageBookings;