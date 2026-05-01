import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
  adminUpdateReportStatus,
  assignEmployeeToReport,
  getAllEmployees,
  getSingleAdminReport,
} from "../src/api/admin.api";

export default function AdminReportDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const reportData = await getSingleAdminReport(id as string);
      const employeeData = await getAllEmployees();

      setReport(reportData);
      setEmployees(employeeData);
    } catch (error) {
      console.log("ADMIN DETAIL ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (employeeId: string) => {
    try {
      await assignEmployeeToReport({ reportId: report._id, employeeId });
      Alert.alert("Assigned", "Employee assigned successfully");
      fetchData();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Assignment failed",
      );
    }
  };

  const handleStatus = async (status: string) => {
    try {
      await adminUpdateReportStatus({ reportId: report._id, status });
      Alert.alert("Updated", "Status updated successfully");
      fetchData();
    } catch (error) {
      Alert.alert("Error", "Status update failed");
    }
  };

  const getStatusBg = (status: string) => {
    if (status === "pending") return "bg-BrightRed";
    if (status === "progress") return "bg-RichPurple";
    return "bg-primary";
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
      className="flex-1 bg-secondary"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Image */}
      <View className="flex-row justify-between px-2 pt-10 items-center mt-10 ">
      <Image source={{ uri: report.image }} className="w-[48%] h-60 rounded-2xl" />
      <Image source={{ uri: report.cleaned_image }} className="w-[48%] h-60 rounded-2xl" />
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-5 bg-white p-2 rounded-full"
      >
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View className="px-5 pt-5">
        {/* Title */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-3xl font-bold text-primary capitalize">
            {report.garbage_type} Garbage
          </Text>

          <View
            className={`${getStatusBg(report.status)} px-4 py-2 rounded-full`}
          >
            <Text className="text-white text-xs capitalize">
              {report.status}
            </Text>
          </View>
        </View>

        <Text className="text-gray-600 mb-5">{report.description}</Text>

        {/* Citizen Info */}
        <View className="bg-white rounded-2xl shadow shadow-primary px-5 py-6 mb-5">
          <Text className="text-lg font-bold text-primary mb-3">
            Citizen Details
          </Text>
          <Text className="text-gray-700 mb-2">
            👤 {report.user?.full_name}
          </Text>
          <Text className="text-gray-700 mb-2">📞 {report.user?.phone}</Text>
          <Text className="text-gray-700 mb-2">🏘 Ward No: {report.ward}</Text>
          <Text className="text-gray-700 mb-2">📍 {report.location_text}</Text>
          <Text className="text-gray-700">
            🕒 {new Date(report.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Assigned Employee */}
        <View className="bg-white rounded-2xl shadow shadow-primary px-5 py-6 mb-5">
          <Text className="text-lg font-bold text-primary mb-3">
            Assigned Worker
          </Text>

          {report.assignedTo ? (
            <>
              <Text className="text-gray-700 mb-2">
                👷 {report.assignedTo.full_name}
              </Text>
              <Text className="text-gray-700">
                📞 {report.assignedTo.phone}
              </Text>
            </>
          ) : (
            <Text className="text-gray-500">No employee assigned yet.</Text>
          )}
        </View>

        {/* Assign Employee */}
        <View className="bg-white  mb-5  shadow shadow-primary px-5 py-2 border rounded-2xl">
          <Picker
            selectedValue=""
            onValueChange={(val) => {
              if (val) handleAssign(val);
            }}
          >
            <Picker.Item label="Assign Employee" value="" />
            {employees.map((emp) => (
              <Picker.Item
                key={emp._id}
                label={emp.full_name}
                value={emp._id}
              />
            ))}
          </Picker>
        </View>

        {/* Status Buttons */}
        <View className="flex-row justify-between mb-5">
          <TouchableOpacity
            onPress={() => handleStatus("pending")}
            className="bg-BrightRed px-4 py-3 rounded-xl"
          >
            <Text className="text-[#fff] ">Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatus("progress")}
            className="bg-RichPurple px-4 py-3 rounded-xl"
          >
            <Text className="text-[#fff]">Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatus("cleaned")}
            className="bg-primary px-4 py-3 rounded-xl"
          >
            <Text className="text-[#fff]">Cleaned</Text>
          </TouchableOpacity>
        </View>

        {/* Before After */}
        {/* <View className="bg-white rounded-2xl shadow shadow-primary px-5 py-6">
          <Text className="text-lg font-bold text-primary mb-4">
            Before / After Evidence
          </Text>

          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-xs text-center text-gray-500 mb-2">
                Reported
              </Text>
              <Image
                source={{ uri: report.image }}
                className="w-full h-36 rounded-2xl"
              />
            </View>

            <View className="w-[48%]">
              <Text className="text-xs text-center text-gray-500 mb-2">
                Cleaned
              </Text>

              {report.cleaned_image ? (
                <Image
                  source={{ uri: report.cleaned_image }}
                  className="w-full h-36 rounded-2xl"
                />
              ) : (
                <View className="w-full h-36 rounded-2xl bg-gray-100 justify-center items-center">
                  <Text className="text-gray-400 text-xs">
                    No proof uploaded
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}
