import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Image } from "react-native";
import SearchBar from "../components/searchBar";
import searchYouTube from "../components/youtubeUtility";
import { YouTubeVideo } from "../components/youtubeUtility";

interface Video {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails: {
            default: { url: string };
            medium: { url: string };
            high: { url: string };
        };
    };
}

export default function Download() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);

    async function handleSearch() {
        if (!searchQuery.trim()) return;
        const results = await searchYouTube({ query: searchQuery, maxResults: 100 });
        setVideos(results);
    }

    return (
        <View className="flex-1 bg-Secondary">
            <FlatList
                ListHeaderComponent={
                    <View className="w-full items-center pt-12 pb-3">
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                }
                stickyHeaderIndices={[0]}

                data={videos as Video[]}
                keyExtractor={(item) => item.id.videoId}
                renderItem={({ item }: { item: Video }) => (
                    <View className="p-4 border-b border-gray-200">
                        <Image
                            source={{ uri: item.snippet.thumbnails.medium.url }}
                            className="w-40 h-24 rounded-lg mb-2"
                        />
                        <Text className="text-white font-bold text-base">
                            {item.snippet.title}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                            {item.snippet.channelTitle}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            {new Date(item.snippet.publishedAt).toLocaleDateString()}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1" numberOfLines={2}>
                            {item.snippet.description}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

