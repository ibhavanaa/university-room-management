import API from "./api";

export const createRequest = (data) => API.post("/maintenance", data);

export const getMyRequests = () => API.get("/maintenance/my");

export const getAllRequests = () => API.get("/maintenance");

export const updateRequestStatus = (id, status) =>
  API.patch(`/maintenance/${id}`, { status });
