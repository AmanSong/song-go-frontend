import { Button } from "@react-navigation/elements";
import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MusicFile } from "../(tabs)";
import MusicManager from "../utils/musicManager";

interface EditTextProps {
    visible: boolean;
    onClose: () => void;
    Song: MusicFile;
}   

export default function EditText({ visible, onClose, Song }: EditTextProps) {
    const [text, setText] = useState('');
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
                                    className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                                    placeholder={Song.name}
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
                                        MusicManager.renameMusic(Song.id, text);
                                        onClose();
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