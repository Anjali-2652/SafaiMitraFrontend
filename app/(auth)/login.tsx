import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { loginUser } from "../../src/api/auth.api";
import { AuthContext } from "../../src/context/AuthContext";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phone || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      const res = await loginUser({ phone, password });
      await login(res.token, res.user);
      Alert.alert("Success", "Login successful");
    } catch (error: any) {
      Alert.alert("Login Failed", error?.response?.data?.message || "Error");
    }
  };

  return (
    <View className="flex-1 bg-secondary justify-center px-6">
      
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-primary">सफाई Mitra</Text>
        <Text className="text-gray-500 mt-2 text-base">
          Janakpur Smart Garbage Management
        </Text>
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-lg">
        <Text className="text-2xl font-bold text-dark mb-6 text-center">
          Welcome Back
        </Text>

        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-2xl px-4 py-4 mb-4 text-base"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-300 rounded-2xl px-4 py-4 mb-2 text-base"
        />

        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity>
            <Text className="text-right text-primary mb-5">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-primary py-4 rounded-2xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Login
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity className="mt-5">
            <Text className="text-center text-gray-600">
              Don’t have an account?{" "}
              <Text className="text-primary font-semibold">Register</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}