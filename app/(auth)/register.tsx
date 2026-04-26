import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { registerUser } from "../../src/api/auth.api";
import { router, Link } from "expo-router";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function RegisterScreen() {
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!full_name || !phone || !address || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      setLoading(true);

      await registerUser({
        full_name,
        phone,
        address,
        password,
      });

      Alert.alert("Success", "Account created successfully");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Register Failed", error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-secondary px-6 pt-20">
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-primary">सफाई Mitra</Text>
        <Text className="text-gray-500 mt-2">Create Your Account</Text>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-lg mb-10">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={full_name}
          onChangeText={setFullName}
        />

        <Input
          label="Phone Number"
          placeholder="Enter phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Input
          label="Address"
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        <Input
          label="Password"
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Register" onPress={handleRegister} loading={loading} />

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity className="mt-5">
            <Text className="text-center text-gray-600">
              Already have an account?{" "}
              <Text className="text-primary font-semibold">Login</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}