import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getAdminDashboard, getAllCitizenReports } from "../../src/api/admin.api";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const dashboard = await getAdminDashboard();
      const reportData = await getAllCitizenReports();

      setStats(dashboard);
      setReports(reportData);
    } catch (error) {
      console.log("ANALYTICS ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [])
  );

  const wardCount = reports.reduce((acc: any, item: any) => {
    acc[item.ward] = (acc[item.ward] || 0) + 1;
    return acc;
  }, {});

  const wardLabels = Object.keys(wardCount).slice(0, 5);
  const wardValues = Object.values(wardCount).slice(0, 5);

  const pieData = [
    {
      name: "Pending",
      population: stats?.pending || 0,
      color: "red",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Progress",
      population: stats?.progress || 0,
      color: "purple",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
    {
      name: "Cleaned",
      population: stats?.cleaned || 0,
      color: "green",
      legendFontColor: "#333",
      legendFontSize: 13,
    },
  ];

  const completionRate = stats?.totalReports
    ? Math.round((stats.cleaned / stats.totalReports) * 100)
    : 0;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-secondary px-4 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAnalytics} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-3xl font-bold text-primaryDark mb-5">
        Smart Analytics
      </Text>

      {/* TOP PERFORMANCE CARD */}
      <View className="  p-6 mb-5 bg-[#abdcab]  rounded-3xl">
        <Text className="text-white text-xl font-bold mb-2">
          Municipality Cleaning Efficiency
        </Text>
        <Text className="text-white text-5xl font-bold">{completionRate}%</Text>
        <Text className="text-white mt-2">
          Total complaints resolved successfully
        </Text>
      </View>

      {/* QUICK STATS */}
      <View className="flex-row flex-wrap justify-between mb-4">
        <View className=" p-5 w-[48%] mb-4 items-center">
          <Ionicons name="people" size={35} color="#1E3A8A" />
          <Text className="text-3xl font-bold text-primary mt-2">
            {stats.totalUsers}
          </Text>
          <Text>Citizens</Text>
        </View>

        <View className="bg-white rounded-3xl p-5 w-[48%] mb-4 items-center">
          <Ionicons name="document-text" size={35} color="#1E3A8A" />
          <Text className="text-3xl font-bold text-primary mt-2">
            {stats.totalReports}
          </Text>
          <Text>Reports</Text>
        </View>
      </View>

      {/* PIE CHART */}
      <View className="bg-white rounded-3xl p-4 mb-5">
        <Text className="text-xl font-bold text-primary mb-4 text-center">
          Complaint Status Distribution
        </Text>

        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: () => `#000`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"20"}
          absolute
        />
      </View>

      {/* BAR CHART */}
      <View className="bg-white rounded-3xl p-4 mb-5">
        <Text className="text-xl font-bold text-primary mb-4 text-center">
          Top Complaint Wards
        </Text>

        <BarChart
          data={{
            labels: wardLabels.map((w) => `W${w}`),
            datasets: [{ data: wardValues as number[] }],
          }}
          width={screenWidth - 40}
          height={260}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => `#ff0000`,
            labelColor: () => `#000000`,
            barPercentage: 0.6,
          }}
          style={{
            borderRadius: 16,
          }}
        />
      </View>

      {/* SMART INSIGHTS */}
      <View className="bg-white rounded-3xl p-5 mb-5">
        <Text className="text-xl font-bold text-primary mb-3">
          AI Municipality Insights
        </Text>

        <Text className="text-gray-700 mb-2">
          • Highest complaint concentration detected in Ward {wardLabels[0] || "-"}
        </Text>

        <Text className="text-gray-700 mb-2">
          • {stats.pending} complaints are awaiting action from municipality staff
        </Text>

        <Text className="text-gray-700 mb-2">
          • {stats.progress} complaints are currently under cleaning process
        </Text>

        <Text className="text-gray-700 mb-2">
          • {stats.cleaned} locations have been successfully cleaned
        </Text>

        <Text className="text-gray-700">
          • Overall municipal response performance is {completionRate}% efficient
        </Text>
      </View>
    </ScrollView>
  );
}