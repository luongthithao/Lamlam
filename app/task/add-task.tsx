import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTask, deleteTask, Task } from "../api";

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const taskId = Array.isArray(id) ? id[0] : id;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data } = await getTask(Number(taskId));
      setTask(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Lỗi khi tải công việc"
      );
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleDelete = () => {
    if (!taskId) return;

    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa công việc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(Number(taskId));
            Alert.alert("Thành công", "Công việc đã được xóa");
            router.replace("/");
          } catch (err: any) {
            Alert.alert(
              "Lỗi",
              err?.response?.data?.message ||
                err?.message ||
                "Không thể xóa công việc"
            );
          }
        },
      },
    ]);
  };

  /* ---------- States ---------- */

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" />
        <Text style={styles.subText}>Đang tải...</Text>
      </Centered>
    );
  }

  if (error) {
    return (
      <Centered>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchTask}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </Centered>
    );
  }

  if (!task) {
    return (
      <Centered>
        <Text>Không tìm thấy công việc</Text>
      </Centered>
    );
  }

  /* ---------- UI ---------- */

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={router.back}>
        <Text style={styles.backText}>⬅️ Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.text}>Mô tả: {task.description || "Không có"}</Text>

      <Text style={styles.text}>Ưu tiên: {task.priority || "Không xác định"}</Text>

      <Text style={styles.text}>Trạng thái: {task.status || "Không xác định"}</Text>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => taskId && router.push({
          pathname: "/task/[id]",
          params: { id: taskId },
        })}
      >
        <Text style={styles.editText}>✏️ Sửa công việc</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>🗑 Xóa công việc</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Shared Component ---------- */

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backBtn: {
    marginBottom: 20,
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
  },
  backText: {
    color: "#fff",
    textAlign: "center",
  },
  editBtn: {
    marginTop: 20,
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 10,
  },
  editText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteBtn: {
    marginTop: 15,
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
