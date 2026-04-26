import React from "react";
import { View, Text } from "react-native";

type Props = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <View className="bg-white rounded-3xl p-5 w-[48%] shadow-md mb-4">
      <Text className="text-gray-500 text-sm">{title}</Text>
      <Text className="text-3xl font-bold text-primary mt-2">{value}</Text>
    </View>
  );
}