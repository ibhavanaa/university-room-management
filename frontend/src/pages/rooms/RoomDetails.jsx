import React from "react";
import { useParams } from "react-router-dom";

function RoomDetails() {
  const { id } = useParams();

  // TODO: Replace with API call -> GET /api/rooms/:id
  const room = {
    _id: id,
    building: "A",
    department: "CS",
    capacity: 40,
    timetable: ["Mon 10-11", "Tue 2-3"],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Room Details</h2>
      <div className="bg-white shadow rounded p-4">
        <p>
          <strong>Building:</strong> {room.building}
        </p>
        <p>
          <strong>Department:</strong> {room.department}
        </p>
        <p>
          <strong>Capacity:</strong> {room.capacity}
        </p>

        <h3 className="text-xl font-semibold mt-4">Weekly Timetable</h3>
        <ul className="list-disc ml-6">
          {room.timetable.map((slot, i) => (
            <li key={i}>{slot}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RoomDetails;
