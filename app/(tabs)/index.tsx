import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl text-blue-500 font-bold">Song Go App</Text>
      <Text className="mt-4 text-lg text-gray-700">
        Welcome to the Song Go App!
      </Text>
    </View>
  );
}