import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import "../global.css";
// type TabRoutes = "index" | "reports" | "notification" | "profile";

export default function HomeScreen() {
  // const [step, setStep] = useState(0);
  // const router = useRouter();

  // useEffect(() => {
  //   const redirect = async () => {
  //     const lastTab = (await AsyncStorage.getItem("lastTab")) as TabRoutes;
  //     if (lastTab == "profile") {
  //       router.replace("/(tabs)/profile");
  //     // } else if (lastTab == "reports") {
  //     //   router.replace("/(tabs)/reports");
  //     // } else if (lastTab == "notification") {
  //     //   router.replace("/(tabs)/notification");
  //     } else {
  //       router.replace("/(tabs)");
  //     }
  //   };
  //   redirect();
  // }, []);

  // const steps = [
  //   {
  //     text: "Schedule a pickup from your location in a few taps.",
  //   },
  //   {
  //     text: "Track collection status and get updates in real time.",
  //   },
  //   {
  //     text: "Confirm completion and rate the service.",
  //   },
  // ];

  // function next() {
  //   setStep((s) => (s + 1) % steps.length);
  // }

  // function prev() {
  //   setStep((s) => (s - 1 + steps.length) % steps.length);
  // }

  return (

    <Redirect href = "/(auth)/login" />

    // <View className="bg-primary h-full">
    //   {/* Top Image */}
    //   <Image
    //     source={require("../public/firstpageimage.png")}
    //     className="w-full h-[400px]"
    //   />

    //   {/* Welcome Text */}
    //   <View className="py-5 px-6">
    //     <Text className="font-semibold text-center text-textWhite text-2xl">
    //       Welcome to <Text className="italic text-3xl">SafaiMitra</Text>
    //       {"\n\n"}
    //       {steps[step].text}
    //     </Text>
    //   </View>

    //   {/* Left Arrow */}
    //   <TouchableOpacity
    //     onPress={prev}
    //     className="absolute bottom-[140px] left-6"
    //   >
    //     <FontAwesome name="long-arrow-left" color="#fff" size={30} />
    //   </TouchableOpacity>

    //   {/* Right Arrow */}
    //   <TouchableOpacity
    //     onPress={next}
    //     className="absolute bottom-[140px] right-6"
    //   >
    //     <FontAwesome name="long-arrow-right" color="#fff" size={30} />
    //   </TouchableOpacity>

    //   {/* Dots Indicator */}
    //   <View className="flex-row justify-center absolute bottom-[110px] w-full">
    //     {steps.map((_, index) => (
    //       <View
    //         key={index}
    //         className={`mx-1 h-3 w-3 rounded-full ${
    //           step === index ? "bg-textWhite" : "bg-gray-400"
    //         }`}
    //       />
    //     ))}
    //   </View>

    //   {/* Get Started Button */}
    //   <TouchableOpacity
    //     onPress={() => router.push("/(auth)/login")}
    //     className="bg-textWhite py-3 px-6 mx-5 absolute bottom-10 rounded-full self-center"
    //   >
    //     <Text className="text-textBlack px-[80px] text-xl font-semibold text-center">
    //       Get Started
    //     </Text>
    //   </TouchableOpacity>
    // </View>
  );
}
