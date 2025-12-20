import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MusicManager from "../../utils/musicManager";

interface EditTextProps {
    visible: boolean;
    onClose: () => void;
    toRename: any;
    type : string;
}   

export default function EditText({ visible, onClose, toRename, type }: EditTextProps) {
    const [text, setText] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <Modal
                    visible={visible}
                    transparent
                    onRequestClose={onClose}
                >

                    <View className="flex-1 justify-center items-center bg-black/50" onTouchStart={() => onClose()}>

                        <View className="bg-white rounded-2xl w-11/12 max-w-md p-6 shadow-lg" onTouchStart={(e) => e.stopPropagation()}>

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold text-gray-800">Edit Text</Text>
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
                                    placeholder={toRename.name}
                                    placeholderTextColor={"#7C7D7D"}
                                    multiline
                                    numberOfLines={4}
                                    autoFocus
                                    onChangeText={setText}
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
                                    onPress={() => { 
                                        {type === "Song" && MusicManager.renameMusic(toRename.id, text)};
                                        {type === "Playlist" && MusicManager.renamePlaylist(toRename.id, text)};
                                        onClose();
                                        return true;
                                    }}
                                    className="justify-center items-center h-12 w-24 rounded-lg bg-Primary"
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