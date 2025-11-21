import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import MusicPlayer from "../components/musicPlayer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { usePlayer } from "../context/playerContext";

interface MusicFile {
    id: string;
    name: string;
    music?: any;
    image?: any;
}

function FullPlayer() {
    const insets = useSafeAreaInsets();
    const { list, index, playlistTitle } = useLocalSearchParams();
    
    const {
        setCurrentTrack,
        setIsPlaying,
        setMusicList,
        setCurrentIndex
    } = usePlayer();

    const musicList: MusicFile[] = typeof list === 'string' ? JSON.parse(list) : [];
    const [currentIndex, setLocalCurrentIndex] = useState(
        typeof index === 'string' ? Number(index) : 0
    );
    const [currentTrack, setLocalCurrentTrack] = useState(musicList[currentIndex]);
    const [hidden, setHidden] = useState(false);

    // Initialize global state
    useEffect(() => {
        setMusicList(musicList);
        setCurrentIndex(currentIndex);
        setCurrentTrack(musicList[currentIndex]);
    }, []);

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : musicList.length - 1;
        setLocalCurrentIndex(newIndex);
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex < musicList.length - 1 ? currentIndex + 1 : 0;
        setLocalCurrentIndex(newIndex);
        setCurrentIndex(newIndex);
    };

    const selectMusic = (music: MusicFile) => {
        const trackIndex = musicList.findIndex(track => track.id === music.id);
        setLocalCurrentIndex(trackIndex);
        setCurrentIndex(trackIndex);
        setLocalCurrentTrack(music);
        setCurrentTrack(music);
    }

    const hidePlayer = () => {
        setHidden(!hidden);
    }

    useEffect(() => {
        const track = musicList[currentIndex];
        setLocalCurrentTrack(track);
        setCurrentTrack(track);
    }, [currentIndex, musicList]);

    const handlePlayStateChange = (playing: boolean) => {
        setIsPlaying(playing);
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#1E1E1E' }}>
            <ImageBackground
                blurRadius={25}
                source={{ uri: currentTrack?.image }}
                className="flex-1 justify-center items-center bg-Secondary/10 rounded-lg">

                <View className="justify-center items-center w-full h-72">
                    <ImageBackground
                        blurRadius={10}
                        source={{ uri: currentTrack?.image }}
                        className="h-64 w-96 justify-center items-center"
                        borderRadius={5}>
                        <Image className="w-72 h-40" source={{ uri: currentTrack?.image }} />
                    </ImageBackground>
                </View>

                <View className="flex-2 w-96 pb-1 pl-2">
                    <Text className="text-xl text-white font-semibold">{playlistTitle ? playlistTitle : "All Songs"}</Text>
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

                <TouchableOpacity
                    onPress={hidePlayer} activeOpacity={1}
                    className={`${hidden ? "h-16" : "h-8"} w-full justify-center items-center bg-Primary/30 rounded-t-xl`}>
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
                            onPlayStateChange={handlePlayStateChange}
                        />
                    </View>
                </View>

            </ImageBackground>

        </View>
    );
}

export default function Player() {
    const { setShowMiniPlayer } = usePlayer();

    // to check if player is focused or not
    useFocusEffect(
        useCallback(() => {
            setShowMiniPlayer(false);
            return () => {
                setShowMiniPlayer(true);
            };
        }, [])
    );

    return <FullPlayer />;
}