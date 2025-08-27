import React from "react";
import { AlertTriangle, Calendar, User, Wrench, CheckCircle, Clock, X } from "lucide-react";
import { formatDate } from "../utils/formatDate";

const MaintenanceCard = ({ 
  request, 
  onStatusUpdate, 
  showAdminActions = false 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Wrench className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          {request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.replace('-', ' ').slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>Priority: {request.priority}</span>
        </div>

        {request.room && (
          <div className="flex items-center text-gray-600">
            <span className="w-4 h-4 mr-2">🏢</span>
            <span>Room: {request.room.name} ({request.room.building})</span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Reported: {formatDate(request.createdAt)}</span>
        </div>

        {request.user && (
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Reported by: {request.user.name}</span>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
          <p className="text-sm text-gray-600">{request.description}</p>
        </div>

        {request.imageUrl && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Attachment:</h4>
            <img 
              src={request.imageUrl} 
              alt="Maintenance issue" 
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {showAdminActions && (
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
          {request.status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(request._id, 'in-progress')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              Start Progress
            </button>
          )}
          {request.status === 'in-progress' && (
            <button
              onClick={() => onStatusUpdate(request._id, 'resolved')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              Mark Resolved
            </button>
          )}
          {request.status !== 'resolved' && (
            <button
              onClick={() => onStatusUpdate(request._id, 'pending')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
            >
              Reopen
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MaintenanceCard;