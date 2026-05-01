import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
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
    }, []),
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
      <Text className="text-3xl font-bold text-primaryDark ">
        Driver Dashboard
      </Text>
      <Text className="text-gray-500 mb-4">
        Track your municipal cleaning performance
      </Text>

      <Image
        source={require("../../public/image3.png")}
        className="w-full h-48 mb-5 rounded-2xl"
      />

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

      <View className="bg-white rounded-3xl p-6 shadow shadow-primary px-8 py-8  ">
        <Text className="text-2xl font-bold text-primary mb-2">
          Employee Guidelines
        </Text>

        <Text className="text-dark mb-2 text-md italic">
          • Visit assigned garbage locations on time
        </Text>
        <Text className="text-dark mb-2 text-md italic">
          • Mark progress when work starts
        </Text>
        <Text className="text-dark mb-2 text-md italic">
          • Upload cleaned proof image after completion
        </Text>
        <Text className="text-dark text-md italic">
          • Maintain ward cleanliness regularly
        </Text>
      </View>
    </ScrollView>
  );
}
