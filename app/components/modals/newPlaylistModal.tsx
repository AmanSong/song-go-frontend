import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MusicManager from "../../utils/musicManager";
import { MusicFile } from "../../utils/musicManager";

interface newPlayListProps {
    visible: boolean;
    onClose: () => void;
}

export default function NewPlayList({ visible, onClose }: newPlayListProps) {
    const [name, setName] = useState("");

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <Modal
                    visible={visible}
                    transparent
                    onRequestClose={onClose}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white rounded-2xl w-11/12 max-w-md p-6 shadow-lg">

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold text-gray-800">Create New PlayList</Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="p-2"
                                >
                                    <Text className="text-2xl text-gray-500">×</Text>
                                </TouchableOpacity>
                            </View>


                            <View className="mb-6">
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-4 text-base text-black bg-gray-50"
                                    placeholder={"Name your playlist"}
                                    multiline
                                    numberOfLines={4}
                                    autoFocus
                                    onChangeText={setName}
                                />
                            </View>

                            <View className="flex-row justify-end space-x-3">
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="justify-center items-center h-12 w-24 mr-2 rounded-lg border border-gray-300"
                                >
                                    <Text className="text-base font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="justify-center items-center h-12 w-24 rounded-lg bg-Primary"
                                    onPress={() => {MusicManager.createPlaylist(name).then(() => onClose()); return true}}
                                >
                                    <Text className="text-white font-medium">Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}