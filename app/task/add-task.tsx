import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { getTask, deleteTask, Task } from "./api"; 
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useCallback để tránh re-render không cần thiết
  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTask(parseInt(id as string, 10)); 
      setTask(response.data); 
    } catch (err: any) {
      // Xử lý lỗi từ Axios (từ interceptor trong api.ts)
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi tải công việc';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa công việc này?",
      [
        { text: "Hủy" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await deleteTask(parseInt(id as string, 10));
              Alert.alert("Thành công", "Công việc đã được xóa!");
              router.push("/"); // Quay về trang chủ
            } catch (err: any) {
              const errorMessage = err.response?.data?.message || err.message || "Không thể xóa công việc";
              Alert.alert("Lỗi", errorMessage);
            }
          },
          style: "destructive",
        },
      ]
    );
  }, [id, router]);

  // Hiển thị loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Đang tải...</Text>
      </View>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", fontSize: 18 }}>Lỗi: {error}</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#007bff",
            padding: 15,
            borderRadius: 10,
          }}
          onPress={loadTask} // Retry
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Nếu không có task (sau khi load xong mà vẫn null)
  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy công việc</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Nút Quay lại */}
      <TouchableOpacity
        style={{
          marginBottom: 20,
          backgroundColor: "#6c757d",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>⬅️ Quay lại</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 28, fontWeight: "bold" }}>{task.title}</Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Mô tả: {task.description || "Không có"}
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Ưu tiên: {task.priority}
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Trạng thái: {task.status}
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#ffc107",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => router.push(`/edit-task/${id}` as any)}
      >
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          ✏️ Sửa công việc
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 15,
          backgroundColor: "#dc3545",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleDelete}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          🗑 Xóa công việc
        </Text>
      </TouchableOpacity>
    </View>
  );
}