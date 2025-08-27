import api from "./api";

export const getAllRequests = async () => api.get("/maintenance");
export const updateRequestStatus = async (id, status) =>
  api.patch(`/maintenance/${id}`, { status });
