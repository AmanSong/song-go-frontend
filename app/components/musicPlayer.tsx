import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";

interface MusicPlayerProps {
    musicUrl?: string;
    onPrevious?: () => void;
    onNext?: () => void;
    onPlayStateChange?: (playing: boolean) => void;
}

export default function MusicPlayer({ musicUrl, onNext, onPrevious, onPlayStateChange }: MusicPlayerProps) {
    // Allow local file playback
    musicUrl = musicUrl?.replace("file:///", "/");

    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    
    let player: AudioPlayer;
    player = useAudioPlayer(null);

    useEffect(() => {
        if(musicUrl) {
            player.replace({uri: musicUrl});
        }
        else {
            player.replace({uri: ''})
        }
    }, [musicUrl]);

    useEffect(() => {
        setDuration(player.duration || 0);
    }, [player.duration, isPlaying])

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
        onPlayStateChange && onPlayStateChange(player.playing);
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
        <View className="flex-1 items-center justify-center">
            <View className="w-full px-8">

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
                    minimumTrackTintColor="#DA7676"
                    maximumTrackTintColor="#E5E5E5"
                    thumbTintColor="#DA7676"
                    className="w-full"
                />

                <View className="flex-row justify-center items-center mt-4">
                    <TouchableOpacity onPress={onPrevious} className="active:opacity-70">
                        <MaterialIcons name="skip-previous" size={40} color={"#DA7676"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePlayPause} className="active:opacity-70 mx-2">
                        <MaterialIcons
                            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                            size={50}
                            color="#DA7676"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNext} className="active:opacity-70">
                        <MaterialIcons name="skip-next" size={40} color={"#DA7676"} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}
