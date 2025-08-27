import { useState } from "react";
import AdminHome from "../admin/AdminHome";
import RoomList from "../rooms/RoomList";
import ManageBookings from "../bookings/ManageBookings";
import ManageRequests from "../maintenance/ManageRequests";
import CreateAlert from "../alerts/CreateAlert";
import AnalyticsPage from "../analytics/AnalyticsPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminHome />;
      case "rooms":
        return <RoomList isAdmin={true} />;
      case "bookings":
        return <ManageBookings />;
      case "maintenance":
        return <ManageRequests />;
      case "alerts":
        return <CreateAlert />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <AdminHome />;
    }
  };

  return <>{renderContent()}</>; // no sidebar, no navbar
};

export default AdminDashboard;
