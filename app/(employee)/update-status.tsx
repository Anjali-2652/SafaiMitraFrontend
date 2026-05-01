import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { getAssignedWorks } from "../../src/api/employee.api";

export default function UpdateStatusHistory() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await getAssignedWorks();
      const filtered = data.filter(
        (item:any) => item.status === "progress" || item.status === "cleaned"
      );
      setReports(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-10">
      <Text className="text-3xl font-bold text-primary mb-6">
        Work History
      </Text>

      {reports.map((item) => (
        <View key={item._id} className="bg-white rounded-3xl p-4 mb-5 shadow">
          <Image source={{ uri: item.image }} className="w-full h-40 rounded-2xl mb-4" />
          <Text className="text-lg font-bold text-primary capitalize">
            {item.garbage_type} Garbage
          </Text>
          <Text className="text-gray-600">{item.description}</Text>
          <Text className="mt-2 font-semibold capitalize">Status: {item.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}