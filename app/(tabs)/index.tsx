import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getTasks, createTask, deleteTask, Task } from "../api";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const router = useRouter();

  const loadTasks = () => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() =>
        Alert.alert("Lỗi", "Không thể tải danh sách task")
      );
  };

  const addTask = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên task");
      return;
    }

    createTask({ title: title.trim(), completed: false })
      .then(() => {
        loadTasks();
        setTitle("");
      })
      .catch(() =>
        Alert.alert("Lỗi", "Không thể thêm task")
      );
  };

  const removeTask = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa task này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () =>
          deleteTask(id)
            .then(loadTasks)
            .catch(() =>
              Alert.alert("Lỗi", "Không thể xóa task")
            ),
      },
    ]);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Danh sách Task
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tên task..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 10,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={addTask}
        style={{
          backgroundColor: "#28a745",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Thêm Task
        </Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/task/${item.id}`)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 15,
              marginBottom: 10,
              backgroundColor: "#fff",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, flex: 1 }}>
              {item.title}
            </Text>

            <TouchableOpacity
              onPress={() => removeTask(item.id)}
              style={{
                backgroundColor: "#dc3545",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff" }}>Xóa</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666" }}>
            Chưa có task nào.
          </Text>
        }
      />
    </View>
  );
}
