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
        <View className="flex-row justify-between items-start w-10/12 p-1 bg-white/10 rounded-2xl my-2 mx-auto">
            <View  className="bg-Primary/90 w-24 items-center rounded-2xl">
                <TouchableOpacity  onPress={() => handlePlayPause()}>
                    {
                        isLoaded ? <MaterialIcons
                            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                            size={50} color="#3C3636"
                        /> : <ActivityIndicator color={"#3C3636"} size={50}></ActivityIndicator>
                    }
                </TouchableOpacity>
            </View>

            <View className="bg-Primary/90 w-24 rounded-2xl">
                <Downloader id={Video.id.videoId} title={Video.snippet.title} image={Video.snippet.thumbnails.high.url}></Downloader>
            </View>
        </View>
    )
}