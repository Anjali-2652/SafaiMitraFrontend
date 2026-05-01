import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";

import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  employeeUpdateStatus,
  getAssignedWorks,
} from "../../src/api/employee.api";

export default function EmployeeHome() {

  const router = useRouter();
  
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredReports, setFilteredReports] = useState<any[]>([]);

  const fetchReports = async () => {
    try {
      const data = await getAssignedWorks();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.log("EMPLOYEE REPORT ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
  setSearch(text);

  if (!text.trim()) {
    setFilteredReports(reports);
    return;
  }

  const lower = text.toLowerCase();

  const filtered = reports.filter((item) => {
    return (
      item.status?.toLowerCase().includes(lower) ||
      item.garbage_type?.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower) ||
      item.user?.full_name?.toLowerCase().includes(lower) ||
      String(item.ward).includes(lower)
    );
  });

  setFilteredReports(filtered);
};

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  const handleStatus = async (reportId: string, status: string) => {
    try {
      // if employee marks cleaned -> capture proof image
      if (status === "cleaned") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          return Alert.alert("Permission Required", "Camera permission needed");
        }

        const result = await ImagePicker.launchCameraAsync({
          quality: 0.7,
        });

        if (result.canceled) return;

        const formData = new FormData();
        formData.append("status", "cleaned");

        formData.append("cleaned_image", {
          uri: result.assets[0].uri,
          name: "cleaned.jpg",
          type: "image/jpeg",
        } as any);

        await employeeUpdateStatus(reportId, formData);
      } else {
        // progress update only
        await employeeUpdateStatus(reportId, { status: "progress" });
      }

      Alert.alert("Success", "Work status updated");
      fetchReports();
    } catch (error: any) {
      console.log("EMPLOYEE FRONTEND STATUS ERROR:", error?.response?.data);
      Alert.alert("Error", error?.response?.data?.message || "Failed");
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
        <RefreshControl refreshing={refreshing} onRefresh={fetchReports} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold text-primary mb-6">
        Assigned Cleaning Tasks
      </Text>
      <View className="bg-white rounded-2xl px-4 py-3 mb-5 flex-row items-center border border-primaryDark">
  <Ionicons name="search" size={20} color="#64748B" />
  <TextInput
    placeholder="Search status / citizen / ward / garbage..."
    value={search}
    onChangeText={handleSearch}
    className="ml-3 flex-1 text-sm"
  />
</View>

      {filteredReports.length === 0 ? (
        <View className="bg-white rounded-3xl p-10 items-center">
          <Text className="text-gray-500">No assigned tasks yet.</Text>
        </View>
      ) : (
        filteredReports.map((item) => (
  <TouchableOpacity
    key={item._id}
    onPress={() => router.push(`/screens/employee-task-details?id=${item._id}`)}
    className="bg-white rounded-2xl flex-row justify-between p-4 mb-5 border border-primaryDark"
  >
    <View className="flex-1 pr-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-primary capitalize">
          {item.garbage_type} Garbage
        </Text>

        <Text
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            item.status === "pending"
              ? "text-BrightRed"
              : item.status === "progress"
              ? "text-RichPurple"
              : "text-primary"
          }`}
        >
          {item.status}
        </Text>
      </View>

      <Text className="text-gray-700">👤 {item.user?.full_name}</Text>
      <Text className="text-gray-500 mt-1">🏘 Ward {item.ward}</Text>

      <Text className="text-xs text-gray-400 mt-2">
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>

    <Image source={{ uri: item.image }} className="w-28 rounded-2xl" />
  </TouchableOpacity>
))
      )}
    </ScrollView>
  );
}
