import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigation() {
  const { token, user, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";
    const inEmployeeGroup = segments[0] === "(employee)";
    const inUserGroup = segments[0] === "(user)";

    // Not logged in
    if (!token) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (!user) return;

    // Admin redirect
    if (user.role === "admin") {
      if (!inAdminGroup) {
        router.replace("/(admin)");
      }
      return;
    }

    // Employee redirect
    if (user.role === "employee") {
      if (!inEmployeeGroup) {
        router.replace("/(employee)");
      }
      return;
    }

    // Citizen redirect
    if (user.role === "user") {
      if (!inUserGroup) {
        router.replace("/(user)");
      }
      return;
    }
  }, [token, user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

 return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)" />
    <Stack.Screen name="(user)" />
    <Stack.Screen name="(admin)" />
    <Stack.Screen name="(employee)" />

    <Stack.Screen name="screens/report-details" />
    <Stack.Screen name="screens/admin-report-details" />
    <Stack.Screen name="screens/change-password" />
    <Stack.Screen name="screens/employee-task-details" />
  </Stack>
);
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}