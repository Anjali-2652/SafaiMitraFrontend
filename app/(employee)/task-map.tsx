import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useFocusEffect } from "expo-router";
import { getAssignedWorks } from "../../src/api/employee.api";

export default function TaskMapScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getAssignedWorks();

      const valid = data.filter(
        (item: any) => item.latitude && item.longitude
      );

      setReports(valid);
    } catch (error) {
      console.log("TASK MAP ERROR:", error);
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

  const getPinColor = (status: string) => {
    if (status === "pending") return "red";
    if (status === "progress") return "purple";
    return "green";
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
      className="flex-1 bg-secondary pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchReports} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold text-primary px-5 mb-5">
        My Cleaning Route Map
      </Text>

      <View className="mx-4 rounded-3xl overflow-hidden border border-primaryDark">
        <MapView
          style={{ width: "100%", height: 550 }}
          initialRegion={{
            latitude: Number(reports[0]?.latitude) || 26.7288,
            longitude: Number(reports[0]?.longitude) || 85.925,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
        >
          {reports.map((item) => (
            <Marker
              key={item._id}
              coordinate={{
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
              }}
              pinColor={getPinColor(item.status)}
            >
              <Callout>
                <View style={{ width: 180 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.garbage_type} Garbage
                  </Text>
                  <Text>Ward: {item.ward}</Text>
                  <Text>Citizen: {item.user?.full_name}</Text>
                  <Text>Status: {item.status}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      <View className="px-5 mt-5">
        <Text className="text-lg font-bold text-primary mb-3">Legend</Text>
        <Text>🔴 Pending</Text>
        <Text>🟣 In Progress</Text>
        <Text>🟢 Completed</Text>
      </View>
    </ScrollView>
  );
}