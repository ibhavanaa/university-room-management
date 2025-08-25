// src/components/AlertBanner.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertBanner = ({ alert, onDismiss }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <span className="text-yellow-800 font-medium">{alert.message}</span>
      </div>

      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="ml-4 text-sm text-yellow-700 hover:underline"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
