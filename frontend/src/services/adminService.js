// src/services/adminService.js
import api from './api';

export const adminService = {
  // Room management
  addRoom: (roomData) => api.post('/rooms', roomData),
  getAllRooms: (filters = {}) => api.get('/rooms', { params: filters }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  updateRoom: (id, roomData) => api.patch(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  
  // Timetable management
  uploadTimetable: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/timetable/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getTimetable: (roomId) => api.get(`/timetable/${roomId}`),
  
  // Booking management
  getAllBookings: () => api.get('/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
  
  // Maintenance management
  getAllMaintenance: () => api.get('/maintenance'),
  updateMaintenanceStatus: (id, status) => api.patch(`/maintenance/${id}`, { status }),
  
  // Alert management
  createAlert: (alertData) => api.post('/alerts', alertData),
  getAllAlerts: () => api.get('/alerts'),
  
  // Analytics
  getBookingStats: () => api.get('/analytics/bookings'),
  getMaintenanceStats: () => api.get('/analytics/maintenance')
};