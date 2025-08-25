import API from "./api";

export const createAlert = (data) => API.post("/alerts", data);

export const getAlerts = () => API.get("/alerts");
