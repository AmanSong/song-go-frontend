import React, { useState } from "react";
import { Modal, View, Text, Image, ImageBackground } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { YouTubeVideo } from "../../utils/youtubeUtility";
import VideoPreview from "../videoPreview";

interface VideoModalProps {
    visible: boolean;
    onClose: () => void;
    video: YouTubeVideo
}

export default function VideoModal({ visible, onClose, video }: VideoModalProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center">
                <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
                    <View className="flex-1 justify-center items-center bg-black/50" onTouchStart={() => onClose()}>
                        <View className="w-11/12 max-h-[90%] p-4" onTouchStart={(e) => e.stopPropagation()}>
                            <ImageBackground
                                source={{ uri: video.snippet.thumbnails.medium.url }}
                                className="w-full rounded-lg overflow-visible p-6"
                                resizeMode="cover"
                                blurRadius={4}
                                borderRadius={5}
                            >
                                <View className="justify-center items-center bg-TransparentWhite rounded-lg p-4 overflow-visible">
                                    <Image
                                        source={{ uri: video.snippet.thumbnails.high.url }}
                                        className="w-full h-44 rounded-lg mb-4"
                                    />
                                    <View className="w-full h-35 p-2 justify-center items-center rounded-lg bg-TransparentWhite">
                                        <Text numberOfLines={2} className="text-balance font-bold mb-4 text-center">
                                            {video.snippet.title}
                                        </Text>
                                        <View className="flex-row">
                                            <VideoPreview {...video} ></VideoPreview>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};
