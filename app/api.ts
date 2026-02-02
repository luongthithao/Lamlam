import axios, { AxiosResponse } from "axios";

/* ---------- Types ---------- */

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  createdAt?: string;
  dueDate?: string;
}

export interface TasksResponse {
  tasks: Task[];
}

/* ---------- Axios Instance ---------- */

const api = axios.create({
  baseURL: "http://10.0.2.2:8000",
  timeout: 5000,
});


/* ---------- Interceptors ---------- */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API ${error.response.status}]`,
        error.response.data
      );
    } else if (error.request) {
      console.error("[NETWORK ERROR]", error.message);
    } else {
      console.error("[REQUEST ERROR]", error.message);
    }

    return Promise.reject(error);
  }
);

/* ---------- API Methods ---------- */

export const getTasks = (): Promise<AxiosResponse<TasksResponse>> => {
  return api.get("/tasks");
};

export const getTask = (id: number): Promise<AxiosResponse<Task>> => {
  return api.get(`/tasks/${id}`);
};

export const createTask = (
  payload: Omit<Task, "id">
): Promise<AxiosResponse<Task>> => {
  return api.post("/tasks", payload);
};

export const updateTask = (
  id: number,
  payload: Partial<Task>
): Promise<AxiosResponse<Task>> => {
  return api.put(`/tasks/${id}`, payload);
};

export const deleteTask = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`/tasks/${id}`);
};
