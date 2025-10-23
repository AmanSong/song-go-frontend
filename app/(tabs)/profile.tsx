import React from 'react';
import {View, Text} from 'react-native';

export default function profile() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl text-blue-500 font-bold">Profile</Text>
      <Text className="mt-4 text-lg text-gray-700">
        This is the Profile screen.
      </Text>
    </View>
  );
}