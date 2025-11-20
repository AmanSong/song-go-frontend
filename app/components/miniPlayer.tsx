import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayer } from '../context/playerContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function MiniPlayer() {
    const router = useRouter();

    const {
        currentTrack,
        isPlaying,
        showMiniPlayer,
        setShowMiniPlayer,
        setIsPlaying,
        musicList,
        stopAndClear
    } = usePlayer();

    const openFullPlayer = () => {
        if (currentTrack && musicList.length > 0) {
            const currentIndex = musicList.findIndex(track => track.id === currentTrack.id);
            router.push({
                pathname: '/player',
                params: {
                    list: JSON.stringify(musicList),
                    index: currentIndex.toString(),
                    playlistTitle: 'Now Playing'
                }
            });
        }
    };

    if (!showMiniPlayer || !currentTrack) {
        return null;
    }

    const onClose = async (e: any) => {
        e.stopPropagation();
        await stopAndClear();
    };

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 130,
                left: 16,
                right: 16,
                zIndex: 50,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={openFullPlayer}
                className="bg-Primary/90 rounded-xl border border-white/20 shadow-lg"
            >
                <View className="flex-row items-center p-3">
                    <Image
                        source={{ uri: currentTrack.image }}
                        className="w-12 h-12 rounded-lg mr-3"
                    />
                    <View className="flex-1">
                        <Text numberOfLines={1} className="text-white font-semibold text-sm">
                            {currentTrack.name}
                        </Text>
                        <Text className="text-white/70 text-xs">
                            {isPlaying ? 'Playing' : 'Paused'}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialIcons
                            name={isPlaying ? 'pause' : 'play-arrow'}
                            size={24}
                            color="white"
                            onPress={() => setIsPlaying(!isPlaying)}
                        />
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onClose(e);
                            }}
                            className="ml-3"
                        >
                            <MaterialIcons name="close" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}