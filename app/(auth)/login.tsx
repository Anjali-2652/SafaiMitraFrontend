import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { loginUser } from "../../src/api/auth.api";
import { AuthContext } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);


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
      <View className="items-center ">
        <Image
          source={require("../../public/logo.png")}
          className="w-40 h-40  rounded-full "
        />
        <Text className="text-gray-500 mt-2 text-base">
          Janakpur Smart Garbage Management
        </Text>
      </View>

      <View className="bg-white px-10 rounded-3xl  py-16 shadow-lg">
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

        <View className="border flex-row  justify-between items-center border-gray-300 rounded-2xl px-4 py-2 mb-2 text-base">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}

            // secureTextEntry
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>

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
