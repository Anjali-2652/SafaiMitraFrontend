import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/ui/Button";
import { registerUser } from "../../src/api/auth.api";

export default function RegisterScreen() {
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <View className="items-center">
        <Image
          source={require("../../public/logo.png")}
          className="w-32 h-32  rounded-full "
        />
      </View>

      <View className="bg-white rounded-3xl px-10 pt-16  py-10 shadow-lg mb-10">
        <Text className="text-2xl font-bold text-dark mb-6 text-center">
          Create Your Account
        </Text>
        <View className=" mb-1 py-2   ">
          <Text className="text-left font-semibold text-dark mb-1">
            Full Name:
          </Text>
          <TextInput
            // label="Full Name"
            placeholder="Enter full name"
            value={full_name}
            onChangeText={setFullName}
            className="border border-dark py-4  rounded-2xl "
          />
        </View>

        <View className="mb-1 py-2  ">
          <Text className="text-left font-semibold text-dark mb-1">
            Phone Number:
          </Text>

          <TextInput
            // label="Phone Number"
            placeholder="Enter phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            className="border border-dark py-4  rounded-2xl"
          />
        </View>

        <View className="mb-1 py-2  ">
          <Text className="text-left font-semibold text-dark mb-1">
            Address:
          </Text>
          <TextInput
            // label="Address"
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            className="border border-dark py-4   rounded-2xl"
          />
        </View>

        <View className=" mb-1 py-2  ">
          <Text className="text-left font-semibold text-dark mb-1">
            Password:
          </Text>
          <View className="flex-row  justify-between items-center border border-dark py-2  rounded-2xl">
          <TextInput
            // label="Password"
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            // secureTextEntry
            // className=""
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
          </View>
        </View>

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
