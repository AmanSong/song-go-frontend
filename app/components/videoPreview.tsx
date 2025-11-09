import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Downloader from './musicDownloader'
import { YouTubeVideo } from "../utils/youtubeUtility";
import { useAudioPlayer } from "expo-audio";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function VideoPreview(Video: YouTubeVideo) {
    const SERVER_IP = process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000';
    const URL = `http://${SERVER_IP}/api/video/stream/${Video.id.videoId}`
    const player = useAudioPlayer(URL ? { uri: URL } : null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!player) return;
        const checkLoaded = () => {
            if (player.isLoaded && !isLoaded) {
                setIsLoaded(true);
            }
        };
        const interval = setInterval(checkLoaded, 100);
        checkLoaded(); 
        return () => clearInterval(interval);
    }, [player, isLoaded]);

    const handlePlayPause = () => {
        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
        setIsPlaying(player.playing)
    };

    return (
        <View className="flex-row items-start px-8">
            <TouchableOpacity onPress={() => handlePlayPause()}>
                {
                    isLoaded ? <MaterialIcons
                        name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                        size={36} color="#fff"
                    /> : <ActivityIndicator color={"#FFFFFF"} size={36}></ActivityIndicator>
                }
            </TouchableOpacity>
            <Downloader id={Video.id.videoId} title={Video.snippet.title} image={Video.snippet.thumbnails.high.url}></Downloader>
        </View>
    )
}