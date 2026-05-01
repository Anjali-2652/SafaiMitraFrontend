import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert, 
} from "react-native";
import { getUserProfile } from "../../src/api/user.api";
import { AuthContext } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
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
      className="flex-1 bg-secondary px-5 pt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold text-primaryDark mb-6">
        My Profile
      </Text>

      {/* Avatar + User Card */}
      <View className=" rounded-full p-6 shadow shadow-primary mb-6 items-center border border-primaryDark">
        <View className="w-20 h-20 rounded-full mt-2 bg-primary justify-center items-center mb-4">
          <Ionicons name="person" size={42} color="#fff" />
        </View>

        <Text className="text-2xl font-bold text-dark mb-1">
          {profile.user.full_name}
        </Text>

        <Text className="text-primary mb-3 font-semibold">
          @{profile.user.username}
        </Text>

        <View className="w-full border-t border-gray-200 pt-4">
          <Text className="text-gray-600 mb-2 text-center">
            📞 {profile.user.phone}
          </Text>

          <Text className="text-gray-600 mb-2 text-center">
            🏠 {profile.user.address}
          </Text>

          <Text className="text-gray-600 capitalize text-center font-medium">
            Citizen Role: {profile.user.role}
          </Text>
        </View>
      </View>

      {/* Stats Circle Section */}
      <View className="bg-white rounded-3xl p-5 pb-10 px-8 mb-6  border-primaryDark shadow  shadow-primary">
        <Text className="text-xl font-bold pt-4  text-primary mb-5 text-center">
          Contribution Summary
        </Text>

        <View className="flex-row justify-between">
          {/* Total */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full  justify-center items-center shadow shadow-RichPurple mb-2">
              <Text className="text-2xl font-bold text-RichPurple">
                {profile.stats.totalReports}
              </Text>
            </View>
            <Text className="text-sm text-RichPurple font-medium">
              Submitted
            </Text>
          </View>

          {/* Cleaned */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full  justify-center items-center shadow  shadow-primary Dark mb-2">
              <Text className="text-2xl font-bold text-primary">
                {profile.stats.cleanedReports}
              </Text>
            </View>
            <Text className="text-sm text-primary font-medium">Cleaned</Text>
          </View>

          {/* Pending */}
          <View className="items-center w-[30%]">
            <View className="w-20 h-20 rounded-full  justify-center items-center shadow shadow-BrightRed mb-2">
              <Text className="text-2xl font-bold text-BrightRed">
                {profile.stats.pendingReports}
              </Text>
            </View>
            <Text className="text-sm font-medium">Pending</Text>
          </View>
        </View>
      </View>

      {/* Change Password */}
      <TouchableOpacity
        onPress={() => router.push("/screens/change-password")}
        className="bg-RichPurple rounded-2xl p-5 mb-4 flex-row justify-center items-center"
      >
        <Ionicons name="lock-closed" size={18} color="#fff" />
        <Text className="text-[#fff] font-semibold text-center ml-2">
          Change Password
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel" },
            { text: "Logout", onPress: logout },
          ])
        }
        className="rounded-2xl p-5 bg-BrightRed flex-row justify-center items-center"
      >
        <Ionicons name="log-out" size={18} color="#fff" />
        <Text className="text-[#fff] font-semibold text-center ml-2">
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
