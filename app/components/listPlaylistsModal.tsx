import React, { useEffect, useState } from "react";
import { View, Modal, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MusicManager from "../utils/musicManager";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MusicFile } from "../utils/musicManager";

interface ListPlaylistProps {
    visible: boolean;
    onClose: () => void;
    song: MusicFile;
}

type Playlist = {
    id: string;
    name: string;
    songIds: string[];
};


export default function ListPlaylistModal({ visible, onClose, song }: ListPlaylistProps) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        getPlayLists();
    }, []);

    async function getPlayLists() {
        const data = await MusicManager.loadPlaylists();
        setPlaylists(data);
    }

    function addToPlaylist(playlistID: string) {
        MusicManager.addSongToPlaylist(playlistID, song.id);
        onClose();
    }

    function isSongInPlaylist(playlist: Playlist): boolean {
        return playlist.songIds.includes(song.id);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <Modal
                    visible={visible}
                    transparent
                    onRequestClose={onClose}
                >
                    <View className="flex-1 justify-center items-center bg-black/50" onTouchStart={() => onClose()}>

                        <View className="bg-white rounded-2xl w-11/12 max-w-md p-2 shadow-lg" onTouchStart={(e) => e.stopPropagation()}>

                            <View className="flex-row justify-between items-center mb-4">
                                <TouchableOpacity onPress={onClose} className="p-2">
                                    <Text className="text-2xl text-gray-500">×</Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <FlatList
                                    data={playlists}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity className="flex-row justify-between p-2 mb-2 flex-1 h-12 w-full bg-Secondary/90 rounded-2xl"
                                            onPress={() => addToPlaylist(item.id)}>
                                            <View className='justify-center'>
                                                <Text className="text-white">{item.name}</Text>
                                            </View>

                                            <MaterialIcons name={isSongInPlaylist(item) ? "bookmark" : "bookmark-outline"} color={"white"} size={25}></MaterialIcons>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>

                        </View>

                    </View>

                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}