import React from "react";
import { Modal, View, Text, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { YouTubeVideo } from "./youtubeUtility";
import { useState } from "react";

interface VideoModalProps {
    visible: boolean;
    onClose: () => void;
    video: YouTubeVideo
}

export default function VideoModal({ visible, onClose, video }: VideoModalProps) {
    const [playPreview, setPlayPreview] = useState(null);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center">
                <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
                    <View className="flex-1 justify-center items-center" onTouchStart={() => onClose()}>
                        <View className="bg-white p-6 w-full max-h-svh max-w-md" onTouchStart={(e) => e.stopPropagation()}>
                            <Image source={{ uri: video.snippet.thumbnails.medium.url }} className="w-full h-48 rounded-lg mb-4" />
                            <Text numberOfLines={2} className="text-lg font-bold mb-4">{video.snippet.title}</Text>

                            <View className="flex-1 justify-center items-center">
                                <Text>Hi</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};
