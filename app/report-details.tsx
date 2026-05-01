import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSingleGarbageReport } from "../src/api/report.api";

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const data = await getSingleGarbageReport(id as string);
      setReport(data);
    } catch (error) {
      console.log("DETAIL ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const getStepColor = (step: string) => {
    if (report.status === "cleaned") return "#16A34A";

    if (
      report.status === "progress" &&
      (step === "pending" || step === "progress")
    ) {
      return "#1E3A8A";
    }

    if (report.status === "pending" && step === "pending") {
      return "#EAB308";
    }

    return "#D1D5DB";
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
      className="flex-1 bg-secondary"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Image */}
      <View className="flex flex-row  justify-between items-center px-2  pt-10 pb-2">
        <Image
          source={{ uri: report.image }}
          className="w-[48%] h-60 rounded-3xl"
        />

        <Image
          source={{ uri: report.cleaned_image }}
          className="w-[48%] h-60 rounded-3xl"
        />
      </View>
      <View className="flex flex-row justify-between px-5 ">
        <Text className="text-RichPurple">Reported Image</Text>
        <Text className="text-RichPurple">Cleaned Image</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-5 bg-white p-2 rounded-full"
      >
        <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View className="px-5 pt-5">
        <Text className="text-3xl font-bold text-primary capitalize mb-2">
          {report.garbage_type} Garbage
        </Text>

        <Text className="text-gray-600 mb-4">{report.description}</Text>

        {/* Ward + Date */}
        <View className="bg-white rounded-2xl shadow  shadow-primary  px-5 py-6  mb-5">
          <Text className="text-gray-700 mb-2">🏘 Ward No: {report.ward}</Text>
          <Text className="text-gray-700 mb-2">📍 {report.location_text}</Text>
          <Text className="text-gray-700">
            🕒 {new Date(report.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Assigned Employee */}
        <View className="bg-white rounded-2xl p-4 shadow shadow-primary  px-5 py-6  mb-5">
          <Text className="text-lg font-bold text-primary mb-2">
            Assigned Worker
          </Text>

          {report.assignedTo ? (
            <>
              <Text className="text-gray-700">
                👷 {report.assignedTo.full_name}
              </Text>
              <Text className="text-gray-700">
                📞 {report.assignedTo.phone}
              </Text>
            </>
          ) : (
            <Text className="text-gray-500">Not assigned yet</Text>
          )}
        </View>

        {/* Status Tracker */}
        <View className="bg-white rounded-2xl p-5 shadow shadow-primary  px-5 py-6">
          <Text className="text-lg font-bold text-primary mb-5">
            Cleaning Progress
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="items-center w-[30%]">
              <View
                className="w-10 h-10 rounded-full bg-BrightRed"
                // style={{ backgroundColor: getStepColor("pending") }}
              />
              <Text className="mt-2 text-xs">Pending</Text>
            </View>

            <View className="h-1 flex-1 bg-gray-300" />

            <View className="items-center w-[30%]">
              <View
                className="w-10 h-10 rounded-full bg-RichPurple"
                // style={{ backgroundColor: getStepColor("progress") }}
              />
              <Text className="mt-2 text-xs">Progress</Text>
            </View>

            <View className="h-1 flex-1 bg-gray-300" />

            <View className="items-center w-[30%]">
              <View
                className="w-10 h-10 rounded-full bg-primary"
                // style={{ backgroundColor: getStepColor("cleaned") }}
              />
              <Text className="mt-2 text-xs">Cleaned</Text>
            </View>
          </View>

          <Text className="text-center mt-5 text-primary font-semibold capitalize">
            Current Status: {report.status}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
