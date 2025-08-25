// src/components/MaintenanceCard.jsx
import React from "react";
import { Wrench } from "lucide-react";

const MaintenanceCard = ({ request, onResolve }) => {
  return (
    <div className="border rounded-2xl shadow p-4 bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          {request.roomName}
        </h3>
        <p className="text-gray-600 text-sm mt-2">{request.issue}</p>
        <p className="text-gray-500 text-sm">
          Status:{" "}
          <span
            className={`font-medium ${
              request.status === "Resolved"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {request.status}
          </span>
        </p>
      </div>

      {onResolve && request.status !== "Resolved" && (
        <button
          onClick={() => onResolve(request.id)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  );
};

export default MaintenanceCard;
