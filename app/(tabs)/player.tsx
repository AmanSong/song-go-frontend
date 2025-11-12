import React, { useState, useEffect } from "react";
import { View, Text, Insets, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MusicPlayer from "../components/musicPlayer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface MusicFile {
    id: string;
    name: string;
    music?: any;
    image?: any;
}

export default function Player() {
    const insets = useSafeAreaInsets();
    const { list, index } = useLocalSearchParams();

    const musicList: MusicFile[] = typeof list === 'string' ? JSON.parse(list) : [];
    const [currentIndex, setCurrentIndex] = useState(
        typeof index === 'string' ? Number(index) : 0
    );
    const [currentTrack, setCurrentTrack] = useState(musicList[currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : musicList.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < musicList.length - 1 ? prev + 1 : 0));
    };

    // Sync currentTrack when currentIndex changes
    useEffect(() => {
        setCurrentTrack(musicList[currentIndex]);
    }, [currentIndex, musicList]);

    return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#1E1E1E' }}>

            <View className="flex-1 bg-Primary px-8 py-8">
                <View className="justify-center items-center bg-black">
                    <Image className="h-64 w-64" source={{uri: currentTrack?.image}}/>
                </View>
            </View>

            <View className="h-72">
                <Text numberOfLines={2} className="text-white text-base font-bold text-center pt-4 mb-2 px-8 h-16">
                    {currentTrack?.name}
                </Text>
                <View className="h-36">
                    <MusicPlayer
                    musicUrl={currentTrack?.music}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
                </View>
            </View>
        </View>
    );
}