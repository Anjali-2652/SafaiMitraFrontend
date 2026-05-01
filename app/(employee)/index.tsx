import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { getAssignedWorks } from "../../src/api/employee.api";

export default function EmployeeDashboard() {
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
    }, [])
  );

  const progressCount = reports.filter((r) => r.status === "progress").length;
  const cleanedCount = reports.filter((r) => r.status === "cleaned").length;
  const assignedCount = reports.length;

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
    >
      <Text className="text-3xl font-bold text-primary mb-2">
        Worker Dashboard
      </Text>
      <Text className="text-gray-500 mb-6">
        Track your municipal cleaning performance
      </Text>

      <View className="flex-row justify-between mb-5">
        <View className="bg-white w-[30%] rounded-3xl p-5 items-center shadow">
          <Text className="text-2xl font-bold text-primary">{assignedCount}</Text>
          <Text className="text-xs mt-1">Assigned</Text>
        </View>

        <View className="bg-white w-[30%] rounded-3xl p-5 items-center shadow">
          <Text className="text-2xl font-bold text-blue-700">{progressCount}</Text>
          <Text className="text-xs mt-1">Progress</Text>
        </View>

        <View className="bg-white w-[30%] rounded-3xl p-5 items-center shadow">
          <Text className="text-2xl font-bold text-green-700">{cleanedCount}</Text>
          <Text className="text-xs mt-1">Cleaned</Text>
        </View>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow">
        <Text className="text-lg font-bold text-primary mb-2">
          Employee Guidelines
        </Text>

        <Text className="text-gray-600 mb-2">• Visit assigned garbage locations on time</Text>
        <Text className="text-gray-600 mb-2">• Mark progress when work starts</Text>
        <Text className="text-gray-600 mb-2">• Upload cleaned proof image after completion</Text>
        <Text className="text-gray-600">• Maintain ward cleanliness regularly</Text>
      </View>
    </ScrollView>
  );
}