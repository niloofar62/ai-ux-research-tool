import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const fetchProjectsApi = () => axios.get(`${API_BASE}/projects`);

export const summarizeApi = (payload) =>
  axios.post(`${API_BASE}/summarize`, payload);

export const deleteProjectApi = (projectId) =>
  axios.delete(`${API_BASE}/projects/${projectId}`);

export default API_BASE;
