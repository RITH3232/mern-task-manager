import api from "./api";

export const getTasks = async () => (await api.get("/tasks")).data;
export const createTask = async (taskData) =>
  (await api.post("/tasks", taskData)).data;
export const updateTask = async (id, taskData) =>
  (await api.put(`/tasks/${id}`, taskData)).data;
export const deleteTask = async (id) => (await api.delete(`/tasks/${id}`)).data;
