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
    const inUserGroup = segments[0] === "(tabs)";

    // 🔐 Not logged in
    if (!token) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (!user) return;

    // ✅ Logged in role redirects
    if (user.role === "admin") {
      if (!inAdminGroup) {
        router.replace("/(admin)");
      }
    }
if (user.role === "employee") {
      if (!inEmployeeGroup) {
        router.replace("/(employee)");
      }
    }
    if (user.role === "user") {
      if (!inUserGroup) {
        router.replace("/(tabs)");
      }
    }

  }, [token, user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
