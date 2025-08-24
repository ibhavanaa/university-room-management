// src/services/upload.js
import api from './api';

export const uploadService = {
  uploadFile: (formData) => {
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};