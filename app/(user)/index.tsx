import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserProfile } from "../../src/api/user.api";
import { AuthContext } from "../../src/context/AuthContext";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getUserProfile();
      setStats(data.stats);
    } catch (error) {
      console.log("HOME STATS ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
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
      className="flex-1 bg-secondary px-5 pt-12"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-gray-500 text-3xl font-semibold text-primaryDark">
          Welcome {user?.full_name} 🙏
        </Text>
        <Text className="italic text-primary font-semibold">
          Report. Track. Clean.
        </Text>
      </View>

      {/* Hero image */}
      <View className="items-center mb-4 shadow">
        <Image
          source={require("../../public/image1.png")}
          className="w-full h-48 rounded-2xl"
        />
      </View>

      {/* Quick Actions */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          onPress={() => router.push("/(user)/create-report")}
          className="p-5 rounded-2xl w-[48%] border-2 border-primaryDark"
        >
          <Ionicons name="camera" size={36} color="#256f45" />
          <Text className="mt-2 text-primary font-semibold">
            Report Garbage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(user)/my-reports")}
          className=" p-5 rounded-2xl w-[48%] border-2 border-primaryDark"
        >
          <Ionicons name="document-text" size={36} color="#256f46" />
          <Text className="mt-3 text-primary font-semibold">My Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Stats */}
      <View className="bg-white  rounded-2xl border-b border-b-primaryDark mb-5">
        <Text className="text-2xl font-bold mb-4 bg-primary text-black px-4 py-2 rounded-lg">
          Your Activity
        </Text>

        <View className="flex-row  pb-4 justify-between">
          {/* Submitted */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-RichPurple ">
              <Text className="text-4xl font-bold text-RichPurple">
                {stats?.totalReports || 0}
              </Text>
            </View>
            <Text className=" text-RichPurple text-sm font-medium">
              Submitted
            </Text>
          </View>

          {/* Cleaned */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-2 shadow shadow-primaryDark">
              <Text className="text-4xl font-bold text-primary">
                {stats?.cleanedReports || 0}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm font-medium text-primary">
              Cleaned
            </Text>
          </View>

          {/* Pending */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full  justify-center items-center mb-2 shadow shadow-BrightRed ">
              <Text className="text-4xl font-bold text-BrightRed">
                {stats?.pendingReports || 0}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm font-medium text-BrightRed">
              Pending
            </Text>
          </View>
        </View>
      </View>


      {/* About */}

      <Text className="mb-2 mt-5 font-semibold text-primaryDark text-2xl"> About Safai Mitra</Text>
      <View className="bg-white px-2 py-2 rounded-2xl mb-5 border-2 border-primaryDark ">
        {/* <Text className="text-lg  text-dark font-bold mb-2">
          About Safai Mitra
        </Text> */}
        <Text className=" italic text-dark">
          Help keep Janakpur clean by reporting garbage issues around you. Your
          contribution helps improve city cleanliness. Your complaint helps
          local sanitation workers identify polluted areas, prioritize urgent
          cleaning, and maintain healthier surroundings in Janakpur.
        </Text>
      </View>
    </ScrollView>
  );
}
