import React, { useState, useEffect, useRef } from "react";
import { View, Text, Insets, TouchableOpacity, Image, FlatList, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import MusicPlayer from "../components/musicPlayer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "@react-navigation/elements";
import Index from ".";

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
    const [hidden, setHidden] = useState(false);

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : musicList.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < musicList.length - 1 ? prev + 1 : 0));
    };

    const selectMusic = (music: MusicFile) => {
        const trackIndex = musicList.findIndex(track => track.id === music.id);
        setCurrentIndex(trackIndex);
        setCurrentTrack(music);
    }

    // Sync currentTrack when currentIndex changes
    useEffect(() => {
        setCurrentTrack(musicList[currentIndex]);
    }, [currentIndex, musicList]);


    //
    const hidePlayer = () => {
        setHidden(!hidden);
    }

    //

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#1E1E1E' }}>
            <ImageBackground
                blurRadius={50}
                source={{ uri: currentTrack?.image }}
                className="flex-1 justify-center items-center bg-Secondary/10 rounded-lg">

                <View className="justify-center items-center w-full h-96">

                    <ImageBackground
                        blurRadius={10}
                        source={{ uri: currentTrack?.image }}
                        className="h-72 w-96 justify-center items-center"
                        borderRadius={5}>
                        <Image className="w-80 h-44" source={{ uri: currentTrack?.image }} />
                    </ImageBackground>

                </View>

                <FlatList className="w-full rounded-xl px-3 mb-8" contentContainerStyle={{ flexGrow: 1 }}
                    data={musicList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }: { item: MusicFile }) => (
                        <View className={`flex-row items-center justify-between p-2 mb-2 rounded-3xl border border-white/10 
                            ${currentTrack?.id === item.id
                                ? 'bg-Primary/90'
                                : 'bg-Secondary/50'
                            }`}>

                            <TouchableOpacity onPress={() => selectMusic(item)}>
                                <View className="flex-row items-start">
                                    <Image className="w-16 h-16 rounded-lg mr-4" resizeMode="cover" source={{ uri: item.image }} />
                                    <View className="max-w-[75%]">
                                        <Text numberOfLines={2} className="text-white font-semibold text-base">
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                    )}
                />

                <TouchableOpacity onPress={hidePlayer} activeOpacity={1} className="h-8 w-full justify-center items-center bg-Primary/30 rounded-t-xl">
                    <MaterialIcons size={36} color={"white"} name="arrow-drop-up"></MaterialIcons>
                </TouchableOpacity>

                <View className={`${hidden ? "opacity-0 h-0 pointer-events-none" : "opacity-100 h-58 w-full"} bg-Primary/30 `}>
                    <View className="h-16">
                        <Text numberOfLines={2} className="text-white text-base font-bold text-center px-8 mt-2">
                            {currentTrack?.name}
                        </Text>
                    </View>
                    <View className="h-32 mb-4 -mt-3">
                        <MusicPlayer
                            musicUrl={currentTrack?.music}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    </View>
                </View>
            </ImageBackground>

        </View>
    );
}