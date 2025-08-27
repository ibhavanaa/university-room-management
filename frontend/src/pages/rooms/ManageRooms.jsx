import React from "react";
import RoomList from "./RoomList";
import { useAuth } from "../../hooks/useAuth";

function ManageRooms() {
  const { user, loading } = useAuth(); // make sure useAuth exposes loading

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Rooms</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <RoomList isAdmin={String(user?.role).toLowerCase() === "admin"} />
      </div>
    </div>
  );
}

export default ManageRooms;
