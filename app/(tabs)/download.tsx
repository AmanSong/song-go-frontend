import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import SearchBar from "../components/searchBar";
import searchYouTube from "../components/youtubeUtility";
import { YouTubeVideo } from "../components/youtubeUtility";

export default function Download() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);

    const data = Array.from({ length: 1 }, (_, i) => `Song ${i + 1}`);

    async function handleSearch() {
        const results = await searchYouTube({query:searchQuery, maxResults:1});
        setVideos(results);
        alert(`Found ${results.length} videos for "${searchQuery}"`);
    }

    return (
        <View className="flex-1 bg-Primary">
            <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View className="p-4 border-b border-gray-200">
                        <Text className="text-white">{item}</Text>
                    </View>
                )}
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
            />
        </View>
    );
}

