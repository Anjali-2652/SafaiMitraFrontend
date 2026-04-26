import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View className="flex-1 justify-center items-center bg-secondary px-6">
      <Text className="text-3xl font-bold text-primary mb-4">Profile</Text>

      <Text className="text-lg mb-2">{user?.full_name}</Text>
      <Text className="text-gray-500 mb-2">{user?.phone}</Text>
      <Text className="text-gray-500 mb-8 capitalize">{user?.role}</Text>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-8 py-4 rounded-2xl"
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}