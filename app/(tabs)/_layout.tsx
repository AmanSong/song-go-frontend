import React from "react";
import { Tabs } from "expo-router";
import { SpecialTabButton } from "@/app/components/specialTabButton";

const Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ headerShown: false, title: "Home" }} 
            />
            <Tabs.Screen
                name="download"
                options={{ headerShown: false, title: "Download", tabBarButton: SpecialTabButton }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                    }
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{ headerShown: false, title: "Profile" }} 
            />
        </Tabs>
    );
}

export default Layout;