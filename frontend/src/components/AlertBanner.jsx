// src/components/AlertBanner.jsx
import React from "react";
import { AlertTriangle, X, Info, CheckCircle } from "lucide-react";
import { formatDate } from "../utils/formatDate";

const AlertBanner = ({ alert, dismissible = false, onDismiss }) => {
  const getAlertIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <Info className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 ${getAlertColor(alert.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getAlertIcon(alert.priority)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{alert.title}</h3>
            <p className="text-sm">{alert.message}</p>
            <p className="text-xs opacity-75 mt-2">
              Posted: {formatDate(alert.createdAt)}
              {alert.expiresAt && ` • Expires: ${formatDate(alert.expiresAt)}`}
            </p>
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-4 text-current hover:opacity-75 transition"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;