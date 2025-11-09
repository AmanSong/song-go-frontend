import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";

interface MusicPlayerProps {
    musicUrl?: string;
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
    // Allow local file playback
    musicUrl = musicUrl?.replace("file:///", "/");
    const player = useAudioPlayer(musicUrl ? { uri: musicUrl } : null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        setDuration(player.duration || 0);
    }, [musicUrl, player.duration]);

    useEffect(() => {
        let interval: any;

        if (isPlaying && !isSeeking) {
            interval = setInterval(() => {
                if (player.isLoaded) {
                    setPosition(player.currentTime || 0);
                }
            }, 250);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, isSeeking, player]);


    const handlePlayPause = () => {
        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
        setIsPlaying(player.playing)
    };

    const onSlidingStart = () => {
        setIsSeeking(true);
    };

    const onSlidingComplete = async (value: number) => {
        if (!player.isLoaded) return;
        const newPosition = value * duration;
        await player.seekTo(newPosition);
        setPosition(newPosition);
        setIsSeeking(false);
    };

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs)) return "0:00";
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? position / duration : 0;

    return (

        <View className="flex-1 items-center justify-center bg-white/10 rounded-lg">
            <View className="w-full max-w-sm px-6">
                <View className="mb-8">
                    <View className="flex-row justify-between items-center w-full px-2 mt-2">
                        <Text className="text-white text-xs">{formatTime(position)}</Text>
                        <Text className="text-white text-xs">{formatTime(duration)}</Text>
                    </View>

                    <Slider
                        minimumValue={0}
                        maximumValue={1}
                        value={progress}
                        onSlidingStart={onSlidingStart}
                        onSlidingComplete={onSlidingComplete}
                        minimumTrackTintColor="#1DB954"
                        maximumTrackTintColor="#E5E5E5"
                        thumbTintColor="#1DB954"
                        className="w-full"
                    />
                </View>

                <View className="items-center">
                    <TouchableOpacity onPress={handlePlayPause} className="active:opacity-70">
                        <MaterialIcons
                            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                            size={64}
                            color="#1DB954"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
