import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/roomService";
import { createBooking } from "../../services/bookingService";

const RoomList = ({ isAdmin }) => {
  const [rooms, setRooms] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    department: "",
    capacity: "",
    status: "available",
    type: "",
    location: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Booking modal (students/faculty)
  const [showBook, setShowBook] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [booking, setBooking] = useState({ date: "", startTime: "", endTime: "", purpose: "" });

  useEffect(() => {
    fetchRooms();
  }, [capacity]);

  useEffect(() => {
    // Optional: auto-refresh when backend emits updates
    let socket;
    try {
      // lazy import to avoid bundling issues if socket.io-client not installed
      import("socket.io-client").then(({ default: io }) => {
        socket = io(process.env.REACT_APP_WS_URL || "http://localhost:5000");
        socket.on("room:update", fetchRooms);
        socket.on("booking:update", fetchRooms);
        socket.on("timetable:update", fetchRooms);
      });
    } catch (e) {}
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms(capacity ? { capacity } : {});
      setRooms(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching rooms", err);
      setError("Failed to fetch rooms. Please try again.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch (err) {
      console.error("Delete failed", err);
      setError("You are not authorized to delete this room.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Trim inputs
      const payload = {
        name: formData.name.trim(),
        building: formData.building.trim(),
        department: formData.department.trim(),
        capacity: formData.capacity,
        status: formData.status,
        type: formData.type.trim(),
        location: formData.location.trim(),
      };

      // Client-side duplicate guard when creating
      if (!editId) {
        const normalize = (v) => String(v || "").trim().toLowerCase();
        const exists = rooms.some((r) =>
          normalize(r.name) === normalize(payload.name) &&
          normalize(r.building) === normalize(payload.building) &&
          normalize(r.department) === normalize(payload.department)
        );
        if (exists) {
          setError("Room already exists.");
          return;
        }
      }

      if (editId) {
        await updateRoom(editId, payload);
      } else {
        await createRoom(payload);
      }
      resetForm();
      fetchRooms();
    } catch (err) {
      console.error("Save failed", err);
      if (err.response?.status === 403) {
        setError("Only admins can add or update rooms.");
      } else if (err.response?.status === 409) {
        setError("Room already exists.");
      } else {
        setError("Failed to save room. Please try again.");
      }
    }
  };

  const openEdit = (room) => {
    setEditId(room._id);
    setFormData({
      name: room.name || "",
      building: room.building || "",
      department: room.department || "",
      capacity: room.capacity || "",
      status: room.status || "available",
      type: room.type || "",
      location: room.location || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      building: "",
      department: "",
      capacity: "",
      status: "available",
      type: "",
      location: "",
    });
    setEditId(null);
    setShowModal(false);
    setError("");
  };

  const openBook = (room) => {
    setBookingRoom(room);
    setBooking({ date: "", startTime: "", endTime: "", purpose: "" });
    setShowBook(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!bookingRoom) return;
    try {
      await createBooking({
        roomId: bookingRoom._id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        purpose: booking.purpose || "General"
      });
      setShowBook(false);
      setBookingRoom(null);
      setBooking({ date: "", startTime: "", endTime: "", purpose: "" });
      setError("");
      fetchRooms();
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed";
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Rooms</h2>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Filter by capacity ≥ N"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Room
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Rooms Table */}
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Building</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Location</th>
              {isAdmin && <th className="p-2 border">Actions</th>}
              {!isAdmin && <th className="p-2 border">Action</th>}
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center p-3">
                  No rooms found.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id} className="hover:bg-slate-50">
                  <td className="p-2 border">{room.name}</td>
                  <td className="p-2 border">{room.building}</td>
                  <td className="p-2 border">{room.department}</td>
                  <td className="p-2 border">{room.capacity}</td>
                  <td className="p-2 border capitalize">{room.status}</td>
                  <td className="p-2 border">{room.type}</td>
                  <td className="p-2 border">{room.location}</td>
                  {isAdmin && (
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => openEdit(room)}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                  {!isAdmin && (
                    <td className="p-2 border">
                      <button
                        onClick={() => openBook(room)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                      >
                        Book
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              {editId ? "Edit Room" : "Add Room"}
            </h3>
            {error && (
              <p className="text-red-600 text-sm mb-2">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Building"
                value={formData.building}
                onChange={(e) =>
                  setFormData({ ...formData, building: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <input
                type="text"
                placeholder="Type (e.g. Lab, Classroom)"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Room Modal (students/faculty) */}
      {showBook && bookingRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Book {bookingRoom.name}</h3>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <form onSubmit={submitBooking} className="space-y-3">
              <input
                type="date"
                value={booking.date}
                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  value={booking.startTime}
                  onChange={(e) => setBooking({ ...booking, startTime: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  type="time"
                  value={booking.endTime}
                  onChange={(e) => setBooking({ ...booking, endTime: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Purpose"
                value={booking.purpose}
                onChange={(e) => setBooking({ ...booking, purpose: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowBook(false)} className="px-3 py-1 rounded border">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
