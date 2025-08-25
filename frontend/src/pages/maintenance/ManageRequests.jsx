import React, { useEffect, useState } from "react";
import MaintenanceCard from "../../components/MaintenanceCard";

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call -> GET /api/maintenance
    setRequests([
      { _id: "1", issue: "Projector not working", status: "Pending" },
      { _id: "2", issue: "AC not cooling", status: "In Progress" },
    ]);
  }, []);

  const handleStatusChange = (id, status) => {
    // TODO: PATCH /api/maintenance/:id
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Maintenance Requests</h2>
      <div className="grid gap-4">
        {requests.map((req) => (
          <MaintenanceCard
            key={req._id}
            request={req}
            isAdmin
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageRequests;
