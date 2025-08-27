// src/components/BookingCard.jsx
import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  ClockIcon,
  Edit3,
  Trash2,
  Loader
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

const BookingCard = ({ 
  booking, 
  onStatusUpdate, 
  onEdit,
  onDelete,
  showAdminActions = false,
  showUserActions = false,
  showUserInfo = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  const getStatusColor = (status) => {
    status = String(status || '').toLowerCase();
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    status = String(status || '').toLowerCase();
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!onStatusUpdate) return;
    
    setLoading(true);
    setActionType(newStatus);
    try {
      await onStatusUpdate(booking._id, newStatus);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setLoading(false);
      setActionType('');
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(booking);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(booking._id);
  };

  const isActionLoading = (action) => loading && actionType === action;

  const statusLower = String(booking.status || '').toLowerCase();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{booking.purpose}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            {String(booking.status || '').charAt(0).toUpperCase() + String(booking.status || '').slice(1).toLowerCase()}
          </span>
        </div>
        
        {(showUserActions || showAdminActions) && (
          <div className="flex space-x-2 ml-4">
            {showUserActions && statusLower === 'pending' && (
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
                aria-label="Edit booking"
                disabled={loading}
              >
                <Edit3 size={18} />
              </button>
            )}
            {showUserActions && statusLower === 'pending' && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
                aria-label="Delete booking"
                disabled={loading}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{booking.room?.name} ({booking.room?.building})</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formatDate(booking.date)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{booking.startTime} - {booking.endTime}</span>
        </div>

        {showUserInfo && booking.user && (
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{booking.user.name} ({booking.user.email})</span>
          </div>
        )}

        {booking.additionalNotes && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
            <p className="text-sm text-gray-600">{booking.additionalNotes}</p>
          </div>
        )}
      </div>

      {showAdminActions && statusLower === 'pending' && (
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleStatusUpdate('Approved')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition flex items-center justify-center"
          >
            {isActionLoading('Approved') ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Approving...
              </>
            ) : (
              'Approve'
            )}
          </button>
          <button
            onClick={() => handleStatusUpdate('Declined')}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg transition flex items-center justify-center"
          >
            {isActionLoading('Declined') ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Declining...
              </>
            ) : (
              'Decline'
            )}
          </button>
        </div>
      )}

      {/* Show status for non-pending bookings in admin view */}
      {showAdminActions && booking.status !== 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCard;