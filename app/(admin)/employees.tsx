import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createEmployeeAccount,
  getAllEmployees,
} from "../../src/api/admin.api";

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.log("EMPLOYEE FETCH ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const handleCreateEmployee = async () => {
    if (!full_name || !phone || !address || !password) {
      return Alert.alert("Error", "Fill all fields");
    }

    try {
      await createEmployeeAccount({
        full_name,
        phone,
        address,
        password,
      });

      Alert.alert("Success", "Employee created successfully");
      setModalVisible(false);

      setFullName("");
      setPhone("");
      setAddress("");
      setPassword("");

      fetchEmployees();
    } catch (error: any) {
      Alert.alert("Failed", error?.response?.data?.message || "Error");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-secondary px-5 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchEmployees} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-primary">Employees</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-primary p-3 rounded-full"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {employees.map((emp) => (
        <View
          key={emp._id}
          className="bg-white rounded-3xl p-5 mb-4 shadow shadow-primary px-10 py-10 border border-primary/10"
        >
          <Text className="text-xl font-bold text-primary">{emp.full_name}</Text>
          <Text className="text-gray-600 mt-1">@{emp.username}</Text>
          <Text className="text-gray-600 mt-1">📞 {emp.phone}</Text>
          <Text className="text-gray-600 mt-1">🏠 {emp.address}</Text>
        </View>
      ))}

      {/* Create Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-primary mb-5">
              Create Employee
            </Text>

            <TextInput
              placeholder="Full Name"
              value={full_name}
              onChangeText={setFullName}
              className="bg-gray-100 rounded-2xl p-4 mb-4"
            />

            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="bg-gray-100 rounded-2xl p-4 mb-4"
            />

            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              className="bg-gray-100 rounded-2xl p-4 mb-4"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-gray-100 rounded-2xl p-4 mb-5"
            />

            <TouchableOpacity
              onPress={handleCreateEmployee}
              className="bg-primary rounded-2xl p-4 mb-3"
            >
              <Text className="text-center text-white font-semibold">
                Create Employee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 rounded-2xl p-4"
            >
              <Text className="text-center text-white font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}