import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { getAssignedWorks } from "../../src/api/employee.api";
import { AuthContext } from "../../src/context/AuthContext";

export default function EmployeeProfile() {
  const { user, logout } = useContext(AuthContext);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getAssignedWorks();
      setReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  const progressCount = reports.filter((r) => r.status === "progress").length;
  const cleanedCount = reports.filter((r) => r.status === "cleaned").length;
  const assignedCount = reports.length;

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-10">
      <Text className="text-3xl font-bold text-primaryDark mb-6">Profile</Text>

      <View className=" rounded-full p-6 shadow shadow-primary mb-6 items-center">
        <View className="w-20 h-20 rounded-full mt-2 bg-primary justify-center items-center mb-4">
          <Ionicons name="person" size={42} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-center text-primary mb-3">
          {user?.full_name}
        </Text>
        <Text className="text-center text-gray-600 mb-2">
          @{user?.username}
        </Text>
        <Text className="text-center text-gray-600 mb-2">📞 {user?.phone}</Text>
        <Text className="text-center text-gray-600 mb-2">
          🏠 {user?.address}
        </Text>
        <Text className="text-center text-gray-600 capitalize">
          Role: {user?.role}
        </Text>
      </View>

      <View className="flex-row justify-between mb-5">
        <View className="items-center w-[30%]">
          <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-BrightRed ">
            <Text className="text-4xl font-bold text-BrightRed">
              {assignedCount}
            </Text>
          </View>
          <Text className=" text-BrightRed text-sm font-medium">Assigned</Text>
        </View>

        <View className="items-center w-[30%]">
          <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-RichPurple ">
            <Text className="text-4xl font-bold text-RichPurple">
              {progressCount}
            </Text>
          </View>
          <Text className=" text-RichPurple text-sm font-medium">Progress</Text>
        </View>

        <View className="items-center w-[30%]">
          <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-primary ">
            <Text className="text-4xl font-bold text-primary">
              {cleanedCount}
            </Text>
          </View>
          <Text className=" text-primary text-sm font-medium">Cleaned</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel" },
            { text: "Logout", onPress: logout },
          ])
        }
        className="bg-BrightRed rounded-2xl py-4"
      >
        <Text className="text-center text-[#fff] font-semibold text-xl">
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
