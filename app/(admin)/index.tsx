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
  Alert,
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
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel" },
                { text: "Logout", onPress: logout },
              ])
            }
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

      {/* SUMMARY CARDS */}
      <View className="flex-row flex-wrap justify-between items-center mt-2">
        <View className="w-[48%] mb-4 bg-lightGreen rounded-3xl px-2 py-2  ">
          <Ionicons name="people" size={34} color="#fff" />
          <Text className="text-3xl  font-bold mt-2 ">{stats.totalUsers}</Text>
          <Text className="text-white font-semibold">Registered Citizens</Text>
        </View>

        <View className="w-[48%]  mb-4 bg-lightCoral rounded-3xl px-2 py-2">
          <Ionicons name="document-text" size={34} color="#fff" />
          <Text className="text-3xl  font-bold mt-1">{stats.totalReports}</Text>
          <Text className="text-white font-semibold">Total Complaints</Text>
        </View>

        <View className="w-[48%]  mb-4 bg-lightPurple rounded-3xl px-2 py-2 ">
          <Ionicons name="construct" size={34} color="#fff" />
          <Text className="text-3xl text-white font-bold mt-2">
            {stats.progress}
          </Text>
          <Text className="text-white font-semibold">In Progress</Text>
        </View>

        <View className="w-[48%]  mb-4 bg-primaryColor rounded-3xl px-2 py-2 ">
          <Ionicons name="checkmark-done" size={34} color="#fff" />
          <Text className="text-3xl text-white font-bold mt-2">
            {stats.cleaned}
          </Text>
          <Text className="text-white font-semibold">Resolved</Text>
        </View>
      </View>

      {/* RESOLUTION RATE */}
      <View className="bg-white rounded-3xl p-5 mt-2 mb-5 border border-primary/10">
        <Text className="text-xl font-bold text-primary mb-3">
          Complaint Resolution Rate
        </Text>

        <View className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{
              width: `${stats.totalReports ? (stats.cleaned / stats.totalReports) * 100 : 0}%`,
              height: "100%",
              backgroundColor: "#16A34A",
            }}
          />
        </View>

        <Text className="mt-3 text-gray-600">
          {stats.totalReports
            ? Math.round((stats.cleaned / stats.totalReports) * 100)
            : 0}
          % reports resolved successfully
        </Text>
      </View>

      {/* LIVE STATUS BOX */}
      <View className="bg-white rounded-3xl p-5 mb-5 border border-primary/10">
        <Text className="text-xl font-bold text-primary mb-4">
          Live Complaint Distribution
        </Text>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700">Pending Complaints</Text>
          <Text className="font-bold text-BrightRed">{stats.pending}</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-700">Ongoing Cleaning</Text>
          <Text className="font-bold text-RichPurple">{stats.progress}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-700">Successfully Cleaned</Text>
          <Text className="font-bold text-primary">{stats.cleaned}</Text>
        </View>
      </View>

      {/* ADMIN INSIGHT */}
      <View className="bg-primary rounded-3xl p-5 mb-5">
        <Text className="text-white text-xl font-bold mb-2">
          Municipal Insight
        </Text>
        <Text className="text-white leading-6">
          Citizens are actively participating in maintaining cleanliness by
          reporting unmanaged waste. Admin can assign employees quickly, monitor
          field work, and ensure timely garbage disposal.
        </Text>
      </View>

      {/* <View className="flex-row flex-wrap justify-between items-center ">
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
      </View> */}

      {/* function for the admin dashboard content ....... */}

      {/* <View className="mt-5  border-2 border-primary  rounded-2xl px-2 py-2 ">
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
      </View> */}
    </ScrollView>
  );
}
