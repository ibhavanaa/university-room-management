import React from "react";

const BookingCard = ({ booking, isAdmin = false, onApprove, onReject }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Room and Basic Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">
          {booking.room?.name || booking.roomId || "Room"} Booking
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Date:</p>
            <p>{booking.date}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Time:</p>
            <p>{booking.startTime} - {booking.endTime}</p>
          </div>
        </div>
      </div>

      {/* User Information - Updated to match your API structure */}
      {isAdmin && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <h4 className="font-medium text-gray-800 mb-2">Requested By:</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {booking.user?.name || booking.userName || "Unknown"}</p>
            <p><span className="font-medium">Email:</span> {booking.user?.email || booking.userEmail || "No email"}</p>
            <p><span className="font-medium">Role:</span> {booking.user?.role || "Unknown role"}</p>
            <p><span className="font-medium">User ID:</span> {booking.user?._id || "N/A"}</p>
          </div>
        </div>
      )}

      {/* Booking Purpose */}
      <div className="mb-4">
        <p className="font-medium text-gray-700">Purpose:</p>
        <p className="text-gray-900">{booking.purpose || "Not specified"}</p>
      </div>

      {/* Status */}
      <div className="mb-4">
        <p className="font-medium text-gray-700">Status:</p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          booking.status === 'Rejected' || booking.status === 'Declined' ? 'bg-red-100 text-red-800' :
          booking.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
          booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {booking.status}
        </span>
      </div>

      {/* Admin Actions - Only show for pending bookings */}
      {isAdmin && booking.status === 'Pending' && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={onApprove}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition font-medium"
          >
            ✅ Approve
          </button>
          <button
            onClick={onReject}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition font-medium"
          >
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;