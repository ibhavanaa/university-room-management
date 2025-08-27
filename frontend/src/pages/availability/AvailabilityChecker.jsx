// src/pages/availability/AvailabilityChecker.jsx
import React, { useState, useEffect } from "react";
import roomService from "../../services/roomService";

function AvailabilityChecker() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all rooms on mount
  useEffect(() => {
    roomService
      .getAllRooms()
      .then((res) => setRooms(res.data || res))
      .catch(() => setRooms([]));
  }, []);

  const checkAvailability = async () => {
    if (!selectedRoom || !date || !time) {
      setStatus("Please select room, date, and time.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const startTime = time;
      // default to 1 hour slot
      const [h, m] = (time || "00:00").split(":");
      const endTime = `${String(Number(h) + 1).padStart(2, "0")}:${m}`;
      const resp = await roomService.checkRoomAvailability({
        roomId: selectedRoom,
        date,
        startTime,
        endTime,
      });
      if (resp.data?.available) {
        setStatus("✅ Room is Available");
        setReason("");
      } else {
        setStatus("❌ Room is Occupied");
        setReason(resp.data?.reason || "Busy");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error checking availability");
      setReason("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Room Availability Checker</h2>

      {/* Selection Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Select Room</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Choose Room --</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        onClick={checkAvailability}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-400"
      >
        {loading ? "Checking..." : "Check Availability"}
      </button>

      {/* Result */}
      {status && (
        <div
          className={`mt-4 p-3 rounded ${
            status.includes("Available")
              ? "bg-green-100 text-green-700"
              : status.includes("Occupied")
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <div>{status}</div>
          {reason && <div className="text-sm opacity-80">{reason}</div>}
        </div>
      )}
    </div>
  );
}

export default AvailabilityChecker;
