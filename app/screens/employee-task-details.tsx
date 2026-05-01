import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  employeeUpdateStatus,
  getAssignedWorks,
} from "../../src/api/employee.api";

export default function EmployeeTaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const all = await getAssignedWorks();
      const found = all.find((r: any) => r._id === id);
      setReport(found);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleStatus = async (status: string) => {
    try {
      if (status === "cleaned") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          return Alert.alert("Permission Required", "Camera permission needed");
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (result.canceled) return;

        const formData = new FormData();
        formData.append("status", "cleaned");
        formData.append("cleaned_image", {
          uri: result.assets[0].uri,
          name: "cleaned.jpg",
          type: "image/jpeg",
        } as any);

        await employeeUpdateStatus(report._id, formData);
      } else {
        await employeeUpdateStatus(report._id, { status: "progress" });
      }

      Alert.alert("Success", "Work status updated");
      fetchReport();
    } catch (error: any) {
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
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ paddingBottom: 100 }}>
      <Image source={{ uri: report.image }} className="w-full h-72" />

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-5 bg-white p-2 rounded-full"
      >
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View className="px-5 pt-5">
        <Text className="text-3xl font-bold text-primary capitalize mb-2">
          {report.garbage_type} Garbage
        </Text>

        <Text className="text-gray-600 mb-5">{report.description}</Text>

        <View className="bg-white rounded-2xl px-5 py-6 mb-5">
          <Text className="text-lg font-bold text-primary mb-3">Citizen Info</Text>
          <Text className="text-gray-700 mb-2">👤 {report.user?.full_name}</Text>
          <Text className="text-gray-700 mb-2">📞 {report.user?.phone}</Text>
          <Text className="text-gray-700 mb-2">🏘 Ward {report.ward}</Text>
          <Text className="text-gray-700 mb-2">📍 {report.location_text}</Text>
        </View>

        <View className="bg-white rounded-2xl px-5 py-6 mb-5">
          <Text className="text-lg font-bold text-primary mb-3">Cleaning Evidence</Text>

          {report.cleaned_image ? (
            <Image source={{ uri: report.cleaned_image }} className="w-full h-56 rounded-2xl" />
          ) : (
            <Text className="text-gray-400">No cleaned proof uploaded yet.</Text>
          )}
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => handleStatus("progress")}
            className="bg-RichPurple px-6 py-3 rounded-xl"
          >
            <Text className="text-white">Start Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatus("cleaned")}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white">Mark Cleaned</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}