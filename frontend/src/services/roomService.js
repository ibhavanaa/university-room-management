import api from "../utils/axiosInstance";

// GET rooms (with optional filters like capacity)
export const getRooms = (params = {}) => api.get("/rooms", { params });

export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const getAllRooms = () => api.get("/rooms");
export const createRoom = (data) => api.post("/rooms", data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);
export const checkRoomAvailability = ({ roomId, date, startTime, endTime }) =>
  api.post(`/rooms/check-availability`, { roomId, date, startTime, endTime });

export default {
  getRooms,
  getRoomById,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
};
