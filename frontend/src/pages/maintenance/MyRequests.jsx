import React, { useEffect, useState } from "react";
import MaintenanceCard from "../../components/MaintenanceCard";

function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call -> GET /api/maintenance/my
    setRequests([
      { _id: "1", issue: "Projector not working", status: "Pending" },
      { _id: "2", issue: "AC not cooling", status: "In Progress" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Maintenance Requests</h2>
      <div className="grid gap-4">
        {requests.map((req) => (
          <MaintenanceCard key={req._id} request={req} />
        ))}
      </div>
    </div>
  );
}

export default MyRequests;
