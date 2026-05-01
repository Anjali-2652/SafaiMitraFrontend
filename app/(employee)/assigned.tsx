import React, { useCallback, useState } from "react";
import *  as ImagePicker from "expo-image-picker";

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
import { useFocusEffect } from "expo-router";
import {
  employeeUpdateStatus,
  getAssignedWorks,
} from "../../src/api/employee.api";

export default function EmployeeHome() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getAssignedWorks();
      setReports(data);
    } catch (error) {
      console.log("EMPLOYEE REPORT ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
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

      {reports.length === 0 ? (
        <View className="bg-white rounded-3xl p-10 items-center">
          <Text className="text-gray-500">No assigned tasks yet.</Text>
        </View>
      ) : (
        reports.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-3xl p-4 mb-5 shadow"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-48 rounded-2xl mb-4"
            />

            <Text className="text-xl font-bold text-primary capitalize">
              {item.garbage_type} Garbage
            </Text>

            <Text className="text-gray-600 mt-1">{item.description}</Text>
            <Text className="text-gray-500 mt-1">
              👤 Citizen: {item.user?.full_name}
            </Text>
            <Text className="text-gray-500 mt-1">📞 {item.user?.phone}</Text>
            <Text className="text-gray-500 mt-1">🏘 Ward {item.ward}</Text>

            <Text className="mt-3 font-semibold text-primary capitalize">
              Current: {item.status}
            </Text>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => handleStatus(item._id, "progress")}
                className="bg-blue-700 px-5 py-2 rounded-xl"
              >
                <Text className="text-white">Start Work</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleStatus(item._id, "cleaned")}
                className="bg-green-600 px-5 py-2 rounded-xl"
              >
                <Text className="text-white">Mark Cleaned</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}