import React from "react";
import { View, Text } from "react-native";

export default function Download() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="items-centered text-2xl text-blue-500 font-bold">Download a song here</Text>
            <Text className="mt-4 text-lg text-gray-700">
                Downloads will appear here
            </Text>
        </View>
    )
}