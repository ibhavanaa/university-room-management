import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomById } from "../../services/roomService";
import { getTimetable } from "../../services/timetableService";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const roomRes = await getRoomById(id);
        setRoom(roomRes.data);

        const ttRes = await getTimetable(id);
        setTimetable(ttRes.data);
      } catch (err) {
        console.error("Error loading room details", err);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!room) return <p>Room not found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{room.building} - {room.department}</h2>
      <p><strong>Capacity:</strong> {room.capacity}</p>

      {/* Timetable */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Weekly Timetable</h3>
        {timetable.length === 0 ? (
          <p>No timetable uploaded.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 border">Day</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2 border">{entry.day}</td>
                  <td className="p-2 border">{entry.time}</td>
                  <td className="p-2 border">{entry.course}</td>
                  <td className="p-2 border">{entry.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
