import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getTasks, createTask, deleteTask, Task } from "../../api";

export default function HomeScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách task");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTask = async () => {
    const trimmed = task.trim();

    if (!trimmed) {
      Alert.alert("Lỗi", "Vui lòng nhập tên task");
      return;
    }

    setAdding(true);
    try {
      const newTask = await createTask({
        title: trimmed,
        priority: "Low",
        status: "Pending",
        task: undefined
      });
      // Thêm task mới vào state để tránh gọi API lại
      setTasks((prevTasks) => [...prevTasks, newTask.data.task]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Lỗi", "Không thể thêm task");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTask = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa task này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(id);
            // Xóa task khỏi state
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Lỗi", "Không thể xóa task");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => router.push(`/task/${item.id}`)}
      style={styles.taskItem}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh Sách Task</Text>

      {/* Ô nhập */}
      <TextInput
        placeholder="Nhập tên task..."
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      {/* Nút thêm */}
      <TouchableOpacity
        onPress={handleAddTask}
        style={[styles.addButton, adding && styles.disabledButton]}
        disabled={adding}
      >
        {adding ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Thêm Task</Text>
        )}
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có task nào.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#343a40",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    color: "#495057",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6c757d",
    marginTop: 50,
    fontSize: 16,
  },
});