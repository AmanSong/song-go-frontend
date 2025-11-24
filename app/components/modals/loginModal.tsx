import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function LoginInputs() {
    return (
        <>
            <View className="justify-center items-center">
                <Text className="justify-center items-center text-lg font-medium text-gray-800 mb-4">
                    Welcome Back!
                </Text>

                <View className="w-10/12">
                    <Text className="p-1">Email</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-4"
                        placeholder={"your@email.com"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-6"
                        placeholder={"password"}
                        secureTextEntry
                    />
                </View>
            </View>

            <View className="justify-center items-center">
                <TouchableOpacity className="mt-8 justify-center items-center bg-Primary h-10 w-10/12 rounded-lg">
                    <Text className="text-base font-medium text-white">Login</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

function SignUpInputs() {
    return (
        <>
            <View className="justify-center items-center">
                <Text className="justify-center items-center text-lg font-medium text-gray-800 mb-3">
                    Create an account
                </Text>

                <View className="w-10/12">
                    <Text className="p-1">Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-3"
                        placeholder={"name"}
                        secureTextEntry
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Email</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-3"
                        placeholder={"your@email.com"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-3"
                        placeholder={"password"}
                        secureTextEntry
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Confirm Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-6"
                        placeholder={"confirm password"}
                        secureTextEntry
                    />
                </View>
            </View>

            <View className="justify-center items-center">
                <TouchableOpacity className="mt-8 justify-center items-center bg-Primary h-10 w-10/12 rounded-lg">
                    <Text className="text-base font-medium text-white">Create account</Text>
                </TouchableOpacity>
            </View>


        </>
    )
}

export default function LoginModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [onLogin, setOnLogin] = useState(true);

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <Modal
                    visible={visible}
                    transparent
                    onRequestClose={onClose}
                >
                    <View className="flex-1 justify-center items-center bg-black/60">
                        <View className="bg-white rounded-2xl w-11/12 max-w-md p-2 shadow-lg" onTouchStart={(e) => e.stopPropagation()}>

                            <TouchableOpacity onPress={onClose} className="p-2">
                                <Text className="text-2xl text-gray-500">×</Text>
                            </TouchableOpacity>

                            {onLogin ?
                                <>
                                    <LoginInputs />
                                    <View className="flex-row justify-center items-center my-4">
                                        <Text>Not signed up?  </Text>
                                        <TouchableOpacity onPress={() => setOnLogin(!onLogin)}>
                                            <Text className="text-Primary">Register</Text>
                                        </TouchableOpacity>
                                    </View></>
                                :
                                <>
                                    <SignUpInputs />
                                    <View className="flex-row justify-center items-center my-4">
                                        <Text>Already have an account?  </Text>
                                        <TouchableOpacity onPress={() => setOnLogin(!onLogin)}>
                                            <Text className="text-Primary">Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }

                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}