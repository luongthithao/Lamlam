import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTask, deleteTask, Task } from "../api"; // nhớ đúng path

export default function TaskDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // ✅ đảm bảo id luôn là string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    if (!id) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getTask(Number(id));
      setTask(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Lỗi khi tải công việc");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleDelete = () => {
    if (!id) return;

    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa công việc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(Number(id));
            Alert.alert("Thành công", "Đã xóa công việc");
            router.replace("/");
          } catch (err: unknown) {
            Alert.alert(
              "Lỗi",
              err instanceof Error ? err.message : "Không thể xóa"
            );
          }
        },
      },
    ]);
  };

  // ⏳ Loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Đang tải...</Text>
      </View>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
        <TouchableOpacity onPress={loadTask} style={{ marginTop: 20 }}>
          <Text style={{ color: "blue" }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🚫 Không có task
  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy công việc</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginBottom: 20,
          backgroundColor: "#6c757d",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          ⬅️ Quay lại
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 28, fontWeight: "bold" }}>{task.title}</Text>

      <Text style={{ marginTop: 10 }}>
        Mô tả: {task.description ?? "Không có"}
      </Text>

      <Text style={{ marginTop: 10 }}>
        Ưu tiên: {task.priority ?? "Không xác định"}
      </Text>

      <Text style={{ marginTop: 10 }}>
        Trạng thái: {task.status ?? "Không xác định"}
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#ffc107",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => router.push(`/edit-task/${id}`)}
      >
        <Text style={{ textAlign: "center" }}>✏️ Sửa công việc</Text>
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
        <Text style={{ color: "#fff", textAlign: "center" }}>
          🗑 Xóa công việc
        </Text>
      </TouchableOpacity>
    </View>
  );
}
