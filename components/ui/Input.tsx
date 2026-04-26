import React from "react";
import { TextInput, View, Text } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="text-gray-600 mb-2 font-medium">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className="border border-gray-300 rounded-2xl px-4 py-4 bg-white"
      />
    </View>
  );
}