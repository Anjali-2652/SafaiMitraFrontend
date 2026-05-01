import React, { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";

export default function EmployeeProfile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView className="flex-1 bg-secondary px-5 pt-10">
      <Text className="text-3xl font-bold text-primary mb-6">Employee Profile</Text>

      <View className="bg-white rounded-3xl p-6 shadow mb-6">
        <Text className="text-xl font-bold text-center text-primary mb-3">
          {user?.full_name}
        </Text>
        <Text className="text-center text-gray-600 mb-2">@{user?.username}</Text>
        <Text className="text-center text-gray-600 mb-2">📞 {user?.phone}</Text>
        <Text className="text-center text-gray-600 mb-2">🏠 {user?.address}</Text>
        <Text className="text-center text-gray-600 capitalize">
          Role: {user?.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={logout}
        className="bg-BrightRed rounded-2xl p-5"
      >
        <Text className="text-center text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}