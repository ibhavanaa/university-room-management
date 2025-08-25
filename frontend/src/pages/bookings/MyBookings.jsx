import React, { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "../../services/bookingService";
import BookingCard from "../../components/BookingCard"; // ← Should be default import
import { toast } from "react-toastify";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, { status: "Cancelled" });
      
      setBookings(prev => prev.map(booking =>
        booking._id === bookingId ? { ...booking, status: "Cancelled" } : booking
      ));
      
      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) {
    return <div className="p-6">Loading your bookings...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={() => handleCancelBooking(booking._id)}
          />
        ))}
      </div>
      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          You haven't made any bookings yet.
        </div>
      )}
    </div>
  );
}

export default MyBookings;