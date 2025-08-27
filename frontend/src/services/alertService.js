import api from "./api";

export const createAlert = async (data) => api.post("/alerts", data);
export const getAlerts = async () => api.get("/alerts");
