import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { changeUserPassword } from "../../src/api/auth.api"

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await changeUserPassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      Alert.alert("Success", res.message);

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message || "Could not change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-secondary px-5 pt-12"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-RichPurple mb-8">
        Change Password
      </Text>

      <View className="bg-white rounded-3xl p-6  border-2 border-primaryDark">
        <View className="flex-row rounded-2xl px-4 py-2  mb-4 border border-RichPurple justify-between items-center">
          <TextInput
            placeholder="Old Password"
            secureTextEntry={!showPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            className="bg-secondary"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row rounded-2xl px-4 py-2  mb-4 border border-RichPurple justify-between items-center">
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-secondary "
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row rounded-2xl px-4 py-2  mb-4 border border-RichPurple justify-between items-center">
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="bg-secondary "
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading}
          className="bg-RichPurple rounded-2xl py-4"
        >
          <Text className="text-[#fff] text-center font-bold text-base">
            {loading ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
