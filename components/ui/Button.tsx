import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function Button({ title, onPress, loading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className="bg-primary py-4 rounded-2xl mt-2"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-bold text-lg">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}