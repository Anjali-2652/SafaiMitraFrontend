import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllCitizenReports } from "../../src/api/admin.api";

export default function AdminReportsScreen() {
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getAllCitizenReports();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.log("ADMIN REPORT ERROR:", error);
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

  const handleSearch = (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      setFilteredReports(reports);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = reports.filter((item) => {
      return (
        item.status?.toLowerCase().includes(lower) ||
        item.garbage_type?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.user?.full_name?.toLowerCase().includes(lower) ||
        String(item.ward).includes(lower)
      );
    });

    setFilteredReports(filtered);
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") return "text-BrightRed";
    if (status === "progress") return "text-RichPurple";
    return "text-primary";
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
      className="flex-1 bg-secondary px-4 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchReports} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-3xl font-bold text-primaryDark mb-6">
        Citizen Reports
      </Text>

      {/* Search */}
      <View className="bg-white rounded-2xl mt-2 px-4 py-3 mb-5 flex-row items-center border border-primaryDark">
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          placeholder="Search citizen / pending / plastic / ward..."
          value={search}
          onChangeText={handleSearch}
          className="ml-3 flex-1 text-sm"
        />
      </View>

      {filteredReports.length === 0 ? (
        <View className="bg-white rounded-3xl p-10 items-center">
          <Text className="text-gray-500">No matching reports found.</Text>
        </View>
      ) : (
        filteredReports.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => router.push(`/admin-report-details?id=${item._id}`)}
            className="bg-white rounded-2xl flex-row justify-between p-4 mb-5 border border-primaryDark"
          >
            <View className="flex-1 pr-2">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-primary capitalize">
                  {item.garbage_type} Garbage
                </Text>

                <Text
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </Text>
              </View>

              <Text className="text-gray-700 mb-1">👤 {item.user?.full_name}</Text>

              <Text className="text-gray-500 mb-1">🏘 Ward No: {item.ward}</Text>

              <Text className="text-xs text-gray-400 mt-2">
                Submitted: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            <Image source={{ uri: item.image }} className="w-28 rounded-2xl" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}