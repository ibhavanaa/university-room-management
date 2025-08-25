// src/services/bookingService.js
import api from './api';

export const bookingService = {
  createBooking: (bookingData) => {
    return api.post('/api/bookings', bookingData);
  },
  
  getMyBookings: () => {
    return api.get('/api/bookings/my');
  },
  
  getAllBookings: () => {
    return api.get('/api/bookings');
  },
  
  updateBooking: (id, bookingData) => {
    return api.patch(`/api/bookings/${id}`, bookingData);
  },
  
  deleteBooking: (id) => {
    return api.delete(`/api/bookings/${id}`);
  }
};