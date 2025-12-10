import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/utils/useAuth";
import { authUtility } from "@/app/utils/authUtility";

function LoginInputs({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    async function handleLogin() {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        const success = await login(email, password);
        if (success) {
            alert("Login Successfully");
            onClose();
        }
        else {
            alert("Login Failed");
            return;
        }
    }

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
                        onChangeText={setEmail}
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-6"
                        placeholder={"password"}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <View className="justify-center items-center">
                <TouchableOpacity onPress={() => handleLogin()} className="mt-8 justify-center items-center bg-Primary h-10 w-10/12 rounded-lg">
                    <Text className="text-base font-medium text-white">Login</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

function SignUpInputs({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const passwordsMatch = password === confirmPassword;

    // In your signup route
    function validatePassword(password: string) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar;
    }

    async function handleSignUp() {

        if (!passwordsMatch) {
            alert("Passwords do not match!");
            return;
        }
        if (email === "") {
            alert("Email can't be empty!");
            return
        }
        if (password === "") {
            alert("Password can't be empty!");
            return
        }

        if(!validatePassword(password)) {
            alert("Password too weak");
        }

        const { data, error } = await authUtility.handleSignUp(name, email, password);

        if (error) {
            alert("An error has occurred while signing up");
            console.error("Error: ", error);
        }

        if (data) {
            if (data.user.identities && data.user.identities.length === 0) {
                alert("User already exists");
                return;
            }
            if (!data.user.confirmed_at) {
                alert(`Successfully signed up! Please check ${email} for verification link.`);
            } else {
                alert("Successfully signed up! You can now sign in.");
            }
            onClose();
        }
    }

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
                        onChangeText={setName}
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Email</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-3"
                        placeholder={"your@email.com"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-3"
                        placeholder={"password"}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                </View>

                <View className="w-10/12">
                    <Text className="p-1">Confirm Password</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-6"
                        placeholder={"confirm password"}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />
                </View>
            </View>

            <View className="justify-center items-center">
                <TouchableOpacity onPress={() => handleSignUp()} className="mt-8 justify-center items-center bg-Primary h-10 w-10/12 rounded-lg">
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
                                    <LoginInputs onClose={onClose} />
                                    <View className="flex-row justify-center items-center my-4">
                                        <Text>Not signed up?  </Text>
                                        <TouchableOpacity onPress={() => setOnLogin(!onLogin)}>
                                            <Text className="text-Primary">Register</Text>
                                        </TouchableOpacity>
                                    </View></>
                                :
                                <>
                                    <SignUpInputs onClose={onClose} />
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