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
import { getTask, deleteTask, Task } from "../../api";  

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = Array.isArray(id) ? id[0] : id;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);  // Thêm state cho delete loading

  const fetchTask = useCallback(async () => {
    if (!taskId || isNaN(Number(taskId))) {
      setError("ID task không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await getTask(Number(taskId));
      setTask(data.task || data);  // Giả định API trả về { task: Task } hoặc trực tiếp Task
    } catch (err: any) {
      console.error("Error fetching task:", err);  // Thêm log để debug
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải công việc"
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

    Alert.alert("Xác nhận", "Bạn muốn xóa công việc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteTask(Number(taskId));
            Alert.alert("Thành công", "Đã xóa công việc", [
              { text: "OK", onPress: () => router.replace("/") },
            ]);
          } catch (err: any) {
            console.error("Error deleting task:", err);  // Thêm log
            Alert.alert(
              "Lỗi",
              err?.response?.data?.message ||
                err?.message ||
                "Không thể xóa công việc"
            );
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    // Tạm thời alert vì không có route edit. Thay bằng router.push nếu có route edit.
    Alert.alert("Thông báo", "Tính năng sửa công việc chưa được triển khai. Vui lòng thêm route edit.");
    // Nếu có route edit, thay bằng: router.push(`/edit-task/${taskId}`);
  };

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.subText}>Đang tải...</Text>
      </Centered>
    );
  }

  if (error) {
    return (
      <Centered>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchTask}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </Centered>
    );
  }

  if (!task) {
    return (
      <Centered>
        <Text style={styles.emptyText}>Không tìm thấy công việc</Text>
      </Centered>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={router.back}>
        <Text style={styles.backText}>⬅️ Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{task.title}</Text>

      <Text style={styles.text}>Mô tả: {task.description || "Không có"}</Text>

      <Text style={styles.text}>Ưu tiên: {task.priority || "Không xác định"}</Text>

      <Text style={styles.text}>Trạng thái: {task.status || "Không xác định"}</Text>

      <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
        <Text style={styles.editText}>✏️ Sửa công việc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteBtn, deleting && styles.disabledBtn]}
        onPress={handleDelete}
        disabled={deleting}
      >
        {deleting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteText}>🗑 Xóa công việc</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#343a40",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#495057",
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6c757d",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  backBtn: {
    marginBottom: 20,
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  editBtn: {
    marginTop: 20,
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  deleteBtn: {
    marginTop: 15,
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: "#6c757d",
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});