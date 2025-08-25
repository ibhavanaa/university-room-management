import React, { useEffect, useState } from "react";
import AlertBanner from "../../components/AlertBanner";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call -> GET /api/alerts
    setAlerts([
      { _id: "1", message: "System maintenance on Aug 30", type: "warning" },
      { _id: "2", message: "New lab rules updated", type: "info" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Alerts & Announcements</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertBanner key={alert._id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

export default AlertsPage;
