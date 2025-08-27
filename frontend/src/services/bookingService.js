import api from "../utils/axiosInstance";

export const getMyBookings = () => api.get("/bookings/my");
export const getAllBookings = () => api.get("/bookings");
export const createBooking = (data) => api.post("/bookings", data);
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}`, { status });

export default {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
};
