import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
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
import { getAdminDashboard } from "../../src/api/admin.api";
import { AuthContext } from "../../src/context/AuthContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useContext(AuthContext);

  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setStats(data);
    } catch (error) {
      console.log("ADMIN DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
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
      className="flex-1 bg-secondary px-5 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchDashboard} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex-row items-center justify-between mb-5">
      <View>
        <Text className="text-2xl font-bold text-primaryDark ">
          Nagarpalika Dashboard
        </Text>
        <Text className="text-dark text-md  mb-4">
          Monitor city cleanliness complaints
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={logout}
          className=" px-4 py-2 rounded-xl"
        >
          <Ionicons name="log-out" size={30} color="#EF4444" />
          {/* <Text className="text-BrightRed font-semibold">Logout</Text> */}
        </TouchableOpacity>
      </View>
      </View>

      {/* hero image .... */}
      <View className="items-center mb-4 shadow">
        <Image
          source={require("../../public/image4.png")}
          className="w-full h-48 rounded-2xl"
        />
      </View>

      <View className="flex-row flex-wrap justify-between items-center ">
        <View className="bg-white w-[48%]  p-5 mb-4  bg-primaryColor rounded-full border ">
          <Ionicons
            name="people"
            size={40}
            color="#ffffff"
            className="text-center"
          />
          <Text className="text-3xl text-[#fff] text-center font-bold  ">
            {stats.totalUsers}
          </Text>
          <Text className=" font-semibold text-center text-[#fff]">
            Citizens
          </Text>
        </View>

        <View className="bg-white w-[48%]  p-5 mb-4 border bg-[#1E3A8A] rounded-full">
          <Ionicons
            name="document-text"
            size={40}
            color="#ffffff"
            className="text-center"
          />
          <Text className="text-3xl text-[#fff] text-center font-bold">
            {stats.totalReports}
          </Text>
          <Text className="text-[#fff] font-semibold text-center">Reports</Text>
        </View>

        <View className="bg-white w-[48%]  p-5 mb-4 border bg-[#EAB308] rounded-full">
          <Ionicons
            name="time"
            size={40}
            color="#ffffff"
            className="text-center"
          />
          <Text className="text-3xl text-[#fff] text-center font-bold">
            {stats.pending}
          </Text>
          <Text className="text-[#fff] mt-1 text-center">Pending</Text>
        </View>

        <View className="bg-white w-[48%]  p-5 mb-4 border rounded-full bg-[#16a34a]">
          <Ionicons
            name="checkmark-done"
            size={40}
            color="#ffffff"
            className="text-center"
          />
          <Text className="text-3xl text-[#fff] text-center font-bold">
            {stats.cleaned}
          </Text>
          <Text className="text-[#fff] mt-1 text-center">Cleaned</Text>
        </View>
      </View>

      {/* function for the admin dashboard content ....... */}

      <View className="mt-5  border-2 border-primary  rounded-2xl px-2 py-2 ">
        <Text className="text-xl mb-2  font-bold text-primary border-b-2 border-primary pb-1">
          Dashboard Content
        </Text>
        <Text>
          Admin has the accessibility to view a comprehensive overview of the
          city's cleanliness status. Monitor the total number of citizens, track
          incoming reports, and stay updated on pending and resolved complaints.
          This dashboard empowers the admin to make informed decisions, allocate
          resources effectively, and ensure a cleaner city for all residents.
        </Text>
      </View>
    </ScrollView>
  );
}
