import React, { useState } from "react";
import { View, Text, FlatList, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import SearchBar from "../components/searchBar";
import searchYouTube from "../components/youtubeUtility";
import { YouTubeVideo } from "../components/youtubeUtility";
import VideoModal from "../components/videoModal";

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

    const [openModal, setOpenModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

    async function handleSearch() {
        if (!searchQuery.trim()) return;
        const results = await searchYouTube({ query: searchQuery, maxResults: 100 });
        setVideos(results);
    }

    function handleVideoSelect(video: YouTubeVideo) {
        setOpenModal(true);
        setSelectedVideo(video);
    }

    return (
        <View className="bg-Secondary pt-8 flex-1">
            <FlatList contentContainerStyle={{ flexGrow: 1 }}
                // Search Bar as Sticky Header
                ListHeaderComponent={
                    <View className="w-full items-center pt-4 pb-4 bg-Secondary">
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                }
                stickyHeaderIndices={[0]}

                // List of Videos
                data={videos as Video[]}
                keyExtractor={(item) => item.id.videoId}
                renderItem={({ item }: { item: Video }) => (
                    <View className="p-4 border-b border-gray-200" onTouchEnd={() => handleVideoSelect(item)}>
                        <View className="flex-row items-start">
                            <Image
                                source={{ uri: item.snippet.thumbnails.medium.url }}
                                className="w-32 h-24 rounded-lg mr-4"
                            />
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base" numberOfLines={2}>
                                    {item.snippet.title}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    {item.snippet.channelTitle}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">
                                    {new Date(item.snippet.publishedAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                ListEmptyComponent={
                    <View>
                        <Text className="text-gray-500 text-center mt-10">
                            No videos found. Try searching for something!
                        </Text>
                    </View>
                }
            />

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    visible={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedVideo(null); // Clear selected video when closing
                    }}
                    video={selectedVideo}
                />
            )}
        </View>
    );
}

