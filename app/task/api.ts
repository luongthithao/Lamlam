import axios, { AxiosResponse } from "axios";

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';  
  status: 'Pending' | 'In Progress' | 'Completed';  
  createdAt?: string;  
  dueDate?: string; 
}


interface TasksResponse {
  tasks: Task[];
}

// Tạo instance Axios
const API = axios.create({
  baseURL: "http://192.168.1.33:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json", // Mặc định cho POST/PUT
  },
});

// Interceptor cho response: Xử lý lỗi chung
API.interceptors.response.use(
  (response: AxiosResponse) => response, // Trả về response bình thường
  (error) => {
    // Xử lý lỗi HTTP (ví dụ: 401, 500)
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      // Bạn có thể thêm logic như redirect login nếu 401
    } else if (error.request) {
      console.error("Network Error:", error.message); // Không kết nối được server
    } else {
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error); // Ném lỗi để hàm gọi xử lý
  }
);

// Hàm API với type safety và xử lý lỗi
export const getTasks = async (): Promise<AxiosResponse<TasksResponse>> => {
  try {
    return await API.get("/tasks");
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw error; // Ném lỗi để component xử lý
  }
};

export const createTask = async (data: Omit<Task, "id">): Promise<AxiosResponse<Task>> => {
  try {
    return await API.post("/tasks", data);
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
};

export const getTask = async (id: number): Promise<AxiosResponse<Task>> => {
  try {
    return await API.get(`/tasks/${id}`);
  } catch (error) {
    console.error("Error in getTask:", error);
    throw error;
  }
};

export const updateTask = async (id: number, data: Partial<Task>): Promise<AxiosResponse<Task>> => {
  try {
    return await API.put(`/tasks/${id}`, data);
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<AxiosResponse<void>> => {
  try {
    return await API.delete(`/tasks/${id}`);
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
};