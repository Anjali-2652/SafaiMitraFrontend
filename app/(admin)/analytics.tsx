import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getWardAnalytics } from "../../src/api/admin.api";

export default function AnalyticsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await getWardAnalytics();
      setData(res);
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
    }, []),
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-secondary px-2 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchAnalytics} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold text-primaryDark mb-6">
        Ward Analytics
      </Text>

      {/* Most Problematic Ward */}
      <View className="  rounded-3xl mb-6">
        <Text className="text-2xl px-4 font-semibold text-BrightRed">
          🚨 Most Problematic Ward
        </Text>
        {/* <Text className="text-3xl px-4 font-semibold text-WarmBrown mt-2">
          Ward {data?.mostProblematicWard || "-"}
        </Text> */}
      </View>

      {/* Ward Cards */}
      {data?.wardStats?.map((ward: any) => {
        const max = Math.max(...data.wardStats.map((w: any) => w.total));
        const widthPercent = (ward.total / max) * 100;

        return (
          <View
            key={ward.ward}
            className="bg-white p-5 rounded-3xl mb-4 shadow shadow-BrightRed px-8 py-10 "
          >
            <Text className="text-lg font-bold text-BrightRed mb-3">
              Ward {ward.ward}
            </Text>

            {/* Bar */}
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <View
                style={{ width: `${widthPercent}%` }}
                className="h-3 bg-BrightRed"
              />
            </View>

            {/* Stats */}
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total:{ward.total}</Text>
              <Text className="text-yellow-600">Pending:{ward.pending}</Text>
              <Text className="text-blue-600">Progress:{ward.progress}</Text>
              <Text className="text-green-600">Cleaned:{ward.cleaned}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
