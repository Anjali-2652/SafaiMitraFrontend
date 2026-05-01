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
import { getMyGarbageReports } from "../../src/api/report.api";
import { getUserProfile } from "../../src/api/user.api";

export default function MyReportsScreen() {
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchAllData = async () => {
    try {
      const reportData = await getMyGarbageReports();
      const profileData = await getUserProfile();

      setReports(reportData);
      setFilteredReports(reportData);
      setStats(profileData.stats);
    } catch (error) {
      console.log("FETCH REPORTS ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      setFilteredReports(reports);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = reports.filter((item) => {
      return (
        item.status.toLowerCase().includes(lower) ||
        item.garbage_type.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold text-primaryDark mb-6">My Reports</Text>

      {/* Dynamic Stats */}
      <View className="bg-white rounded-2xl mb-5 ">
        <Text className="text-2xl font-bold mb-4 bg-primary text-black px-4 py-2 rounded-lg">
          Your Activity
        </Text>

        <View className="flex-row justify-between">
          {/* Submitted */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-RichPurple bg-blue-50">
              <Text className="text-4xl font-bold text-RichPurple">
                {stats?.totalReports || 0}
              </Text>
            </View>
            <Text className="text-sm text-RichPurple font-medium">
              Submitted
            </Text>
          </View>

          {/* Cleaned */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-primaryDark bg-green-50">
              <Text className="text-4xl font-bold text-primary">
                {stats?.cleanedReports || 0}
              </Text>
            </View>
            <Text className="text-primary text-sm font-medium">Cleaned</Text>
          </View>

          {/* Pending */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-BrightRed">
              <Text className="text-4xl font-bold text-BrightRed">
                {stats?.pendingReports || 0}
              </Text>
            </View>
            <Text className="text-BrightRed text-sm font-medium">Pending</Text>
          </View>
        </View>
      </View>

      {/* SEARCH BOX */}
      <View className="bg-white rounded-2xl mt-2 px-4 py-3 mb-5 flex-row items-center justify-center border border-primaryDark">
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          placeholder="Search pending / cleaned / plastic / ward..."
          value={search}
          onChangeText={handleSearch}
          className="ml-3 flex-1 text-sm "
        />
      </View>

      {/* REPORTS */}
      {filteredReports.length === 0 ? (
        <View className="bg-white rounded-3xl p-10 items-center">
          <Text className="text-gray-500 text-base">
            No matching reports found.
          </Text>
        </View>
      ) : (
        filteredReports.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => router.push(`/report-details?id=${item._id}`)}
            className="bg-white rounded-2xl flex flex-row justify-between p-4 mb-5 border border-primaryDark"
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

              <Text className="text-gray-700 mb-2">{item.description}</Text>

              <Text className="text-sm text-gray-500 mb-1">
                🏘 Ward No: {item.ward}
              </Text>

              <Text className="text-xs text-gray-400 mt-2">
                Submitted: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            <Image source={{ uri: item.image }} className="w-32 rounded-2xl" />
            {/* <Image source={{ uri: item.cleaned_image }} className="w-32 rounded-2xl" /> */}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
