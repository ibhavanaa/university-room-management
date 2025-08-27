import api from "./api";

export const uploadTimetable = async (roomId, formData) => {
  const url = roomId ? `/rooms/${roomId}/timetable/upload` : `/timetable/upload`;
  return api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getTimetable = async (roomId) =>
  api.get(`/timetable/${roomId}`);
