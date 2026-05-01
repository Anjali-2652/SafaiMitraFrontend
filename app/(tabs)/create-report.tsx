import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
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
import { createGarbageReport } from "../../src/api/report.api";

export default function CreateReportScreen() {
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [garbageType, setGarbageType] = useState("plastic");
  const [ward, setWard] = useState("");
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // pick image from camera/gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert("Permission required", "Camera permission needed");
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // fetch location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return Alert.alert("Permission required", "Location permission needed");
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);

    setLocationText(
      `Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`,
    );
  };

  // submit report
  const handleSubmit = async () => {
    if (!image || !description || !ward) {
      return Alert.alert("Error", "Please fill all required fields");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("description", description);
      formData.append("garbage_type", garbageType);
      formData.append("location_text", locationText);
      formData.append("latitude", String(latitude));
      formData.append("longitude", String(longitude));
      formData.append("ward", ward);

      const localUri = image.uri;
      const filename = localUri.split("/").pop() || "photo.jpg";

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      console.log("IMAGE DATA:", { localUri, filename, type });

      formData.append("image", {
        uri: localUri,
        name: filename,
        type,
      } as any);

      await createGarbageReport(formData);

      Alert.alert("Success", "Garbage report submitted");

      setImage(null);
      setDescription("");
      setWard("");
      setLocationText("");
    } catch (error: any) {
      console.log("UPLOAD ERROR FULL:", error);
      console.log("UPLOAD ERROR RESPONSE:", error?.response?.data);
      console.log("UPLOAD ERROR MESSAGE:", error?.message);

      Alert.alert(
        "Upload Failed",
        error?.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-secondary px-5 pt-10"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold text-primaryDark mb-6">
        Create Garbage Report
      </Text>

      {/* Image Picker */}
      <TouchableOpacity
        onPress={pickImage}
        className="bg-white p-5 rounded-2xl border border-primaryDark shadow  shadow-primary items-center mb-5"
      >
        <Text className="text-primary font-semibold">
          {image ? "Retake Photo" : "Capture Garbage Photo"}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          className="w-full h-52 rounded-2xl mb-5"
        />
      )}

      {/* Location */}
      <TouchableOpacity
        onPress={getLocation}
        className="bg-white p-5 border border-primaryDark shadow shadow-primary  rounded-2xl  items-center mb-5"
      >
        <Text className="text-primary font-semibold">
          Fetch Current Location
        </Text>
      </TouchableOpacity>

      {locationText ? (
        <Text className="mb-5 text-gray-600">{locationText}</Text>
      ) : null}

      {/* Description */}
      <TextInput
        placeholder="Describe the garbage issue"
        value={description}
        onChangeText={setDescription}
        multiline
        className="bg-white rounded-2xl p-4 mb-5 h-28 border border-primaryDark"
      />

      {/* Garbage Type */}
      <View className="bg-white  mb-5 border border-primary rounded-2xl">
        <Picker
          selectedValue={garbageType}
          onValueChange={(itemValue) => setGarbageType(itemValue)}
        >
          <Picker.Item label="Plastic" value="plastic" />
          <Picker.Item label="Organic" value="organic" />
          <Picker.Item label="Metal" value="metal" />
          <Picker.Item label="Mixed" value="mixed" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Ward */}
      <TextInput
        placeholder="Ward Number"
        value={ward}
        onChangeText={setWard}
        keyboardType="numeric"
        className="bg-white border border-primaryDark rounded-2xl  p-4 mb-6"
      />

      <Button title="Submit Report" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
}
