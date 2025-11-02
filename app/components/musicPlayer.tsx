import React, { use, useState } from "react";
import { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { useAudioPlayer } from 'expo-audio';
import { StatusBar } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MusicPlayerProps {
    musicUrl?: string;
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
    const player = useAudioPlayer(musicUrl ? { uri: musicUrl } : null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        console.log("Music URL received in MusicPlayer:", musicUrl);
    }, [musicUrl]);

    useEffect(() => {
        setIsPlaying(player.playing);
    }, [player.playing]);

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <View className="flex-row items-center justify-center bg-WhiteAlpha rounded-lg">
            <TouchableOpacity onPress={() => {handlePlayPause()}}>
                <MaterialIcons name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={54} color="black" />
            </TouchableOpacity>

            <TouchableOpacity>
                <MaterialIcons name="download" size={54} color="black" />
            </TouchableOpacity>
        </View>
    );
}