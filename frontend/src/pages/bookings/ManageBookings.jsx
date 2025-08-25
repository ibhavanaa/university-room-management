import React, { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../../services/bookingService";
import BookingCard from "../../components/BookingCard";
import { toast } from "react-toastify";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setError("Failed to load bookings. Please try again.");
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus });
      
      // Update local state
      setBookings(prev => prev.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Failed to update booking status:", error);
      toast.error(`Failed to ${newStatus.toLowerCase()} booking`);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Filter bookings by status for better organization
  const pendingBookings = bookings.filter(b => b.status === "Pending");
  const approvedBookings = bookings.filter(b => b.status === "Approved");
  const rejectedBookings = bookings.filter(b => b.status === "Rejected");
  const cancelledBookings = bookings.filter(b => b.status === "Cancelled");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>

      {/* Pending Bookings - Needs Admin Action */}
      {pendingBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Pending Approval ({pendingBookings.length})</h3>
          <div className="grid gap-6">
            {pendingBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isAdmin={true}
                onApprove={() => handleStatusChange(booking._id, "Approved")}
                onReject={() => handleStatusChange(booking._id, "Rejected")}
                // REMOVED onCancel for admin - they shouldn't cancel bookings
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved Bookings */}
      {approvedBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Approved Bookings ({approvedBookings.length})</h3>
          <div className="grid gap-6">
            {approvedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isAdmin={true}
                // REMOVED onCancel for admin - they shouldn't cancel approved bookings
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Bookings */}
      {rejectedBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-red-600">Rejected Bookings ({rejectedBookings.length})</h3>
          <div className="grid gap-6">
            {rejectedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-600">Cancelled Bookings ({cancelledBookings.length})</h3>
          <div className="grid gap-6">
            {cancelledBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg">No bookings found</p>
          <p className="text-gray-500">All booking requests will appear here</p>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;