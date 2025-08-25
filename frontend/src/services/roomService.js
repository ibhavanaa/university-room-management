// src/services/roomService.js
import api from './api';

export const roomService = {
  getAllRooms: () => {
    return api.get('/api/rooms');
  },
  
  getRoomById: (id) => {
    return api.get(`/api/rooms/${id}`);
  },
  
  checkRoomAvailability: (roomId, dateTime) => {
    return api.get(`/api/rooms/${roomId}/availability?datetime=${dateTime}`);
  },
  
  // Admin only functions
  createRoom: (roomData) => {
    return api.post('/api/rooms', roomData);
  },
  
  updateRoom: (id, roomData) => {
    return api.patch(`/api/rooms/${id}`, roomData);
  },
  
  deleteRoom: (id) => {
    return api.delete(`/api/rooms/${id}`);
  }
};