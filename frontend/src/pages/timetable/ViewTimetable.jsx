import { useEffect, useState } from "react";
import roomApi from "../../services/roomService";
import { getTimetable } from "../../services/timetableService";

export default function ViewTimetable() {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    roomApi
      .getAllRooms()
      .then((res) => setRooms(res.data || res))
      .catch(() => setRooms([]));
  }, []);

  const load = async () => {
    if (!roomId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getTimetable(roomId);
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">View Timetable</h2>

      <div className="flex gap-3 items-end mb-4">
        <div>
          <label className="block text-sm mb-1">Select Room</label>
          <select
            className="border rounded px-3 py-2 min-w-[280px]"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">-- Choose Room --</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.building})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={load}
          disabled={!roomId || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-slate-400"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {data && (
        <div className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <div className="font-semibold">{data.roomName}</div>
            <div className="text-sm text-slate-600">
              {data.building} • {data.department}
            </div>
          </div>

          {data.timetable.length === 0 ? (
            <p className="text-sm text-slate-600">No timetable uploaded.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {data.timetable.map((day) => (
                <div key={day._id || day.day} className="border rounded">
                  <div className="px-3 py-2 font-semibold bg-slate-50 border-b">
                    {day.day}
                  </div>
                  <ul className="divide-y">
                    {day.lectures.map((lec, idx) => (
                      <li key={idx} className="px-3 py-2 text-sm">
                        <div className="font-medium">
                          {lec.startTime} – {lec.endTime}
                        </div>
                        <div className="text-slate-700">{lec.course}</div>
                        {lec.faculty && (
                          <div className="text-slate-500">{lec.faculty}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


