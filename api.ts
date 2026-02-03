import axios, { AxiosResponse } from "axios";

/* ---------- Types ---------- */

// Model Task chuẩn — KHÔNG có task: Task
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  createdAt?: string;
  dueDate?: string;
}

// Backend trả về danh sách
export interface TasksResponse {
  tasks: Task[];
}

// Backend trả về 1 task
export interface TaskResponse {
  task: Task;
}

/* ---------- Axios Instance ---------- */

export const API_URL = "http://10.0.2.2:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

/* ---------- Interceptors ---------- */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.log("API ERROR:", error);
    return Promise.reject(error);
  }
);

/* ---------- API Methods ---------- */

// Lấy tất cả tasks
export const getTasks = (): Promise<AxiosResponse<TasksResponse>> => {
  return api.get("/tasks");
};

// Lấy 1 task theo ID
export const getTask = (id: number): Promise<AxiosResponse<TaskResponse>> => {
  return api.get(`/tasks/${id}`);
};

// Tạo task mới
export const createTask = (
  payload: Omit<Task, "id">
): Promise<AxiosResponse<TaskResponse>> => {
  return api.post("/tasks", payload);
};

// Update task
export const updateTask = (
  id: number,
  payload: Partial<Task>
): Promise<AxiosResponse<TaskResponse>> => {
  return api.put(`/tasks/${id}`, payload);
};

// Xóa task
export const deleteTask = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/tasks/${id}`);
};
