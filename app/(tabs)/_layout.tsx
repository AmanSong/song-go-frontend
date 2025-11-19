import React from "react";
import { Tabs } from "expo-router";
import SpecialTabButton from "@/app/components/specialTabButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";


function CustomTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#3C3636",
                    height: 50 + insets.bottom,
                    paddingBottom: insets.bottom,
                    borderTopWidth: 0
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View pointerEvents="none" className="justify-center items-center h-12 w-12 pt-1">
                            <MaterialIcons
                                pointerEvents="none"
                                name="queue-music"
                                size={40}
                                color={focused ? "#DA7676" : "#A0A0A0"}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="download"
                options={{ tabBarButton: SpecialTabButton }}
                listeners={{
                    tabPress: (e) => e.preventDefault(),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View pointerEvents="none" className="justify-center items-center h-12 w-12 pt-1">
                            <MaterialIcons
                                pointerEvents="none"
                                name="account-circle"
                                size={40}
                                color={focused ? "#DA7676" : "#A0A0A0"}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="player"
                options={{
                    href: null,
                    tabBarStyle: { display: 'none' }
                }}
            />
        </Tabs>
    );
}

export default function Layout() {
    return (
        <SafeAreaProvider>
            <CustomTabs />
        </SafeAreaProvider>
    );
}