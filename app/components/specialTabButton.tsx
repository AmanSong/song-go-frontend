import React from "react";
import * as Haptics from "expo-haptics";
import { TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function() {
    const router = useRouter();
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/download");
    };

    return (
        <TouchableOpacity className="flex-1 justify-center items-center rounded-full -top-3" activeOpacity={0.9} onPress={handlePress}>
            <View className="w-16 h-16 rounded-full bg-Primary items-center justify-center shadow-lg">
                <Text className="text-white text-lg font-bold">+</Text>
            </View>
        </TouchableOpacity>
    )
}