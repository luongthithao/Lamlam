import React, { useCallback, useEffect, useState } from "react";
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
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks);
    } catch {
      Alert.alert("Lỗi", "Không thể tải danh sách task");
    }
  }, []);

  const handleAddTask = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert("Lỗi", "Vui lòng nhập tên task");
      return;
    }

    try {
      await createTask({
        title: trimmedTitle,
        priority: "Low", // or another default value as required by your Task type
        status: "Pending",  // or another default value as required by your Task type
      });
      setTitle("");
      fetchTasks();
    } catch {
      Alert.alert("Lỗi", "Không thể thêm task");
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
            fetchTasks();
          } catch {
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
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 16, flex: 1 }}>{item.title}</Text>

      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={{
          backgroundColor: "#dc3545",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff" }}>Xóa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        Danh sách 
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tên..."
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
        onPress={handleAddTask}
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
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666" }}>
            Chưa có task nào.
          </Text>
        }
      />
    </View>
  );
}
