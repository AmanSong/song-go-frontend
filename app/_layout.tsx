import { Stack } from "expo-router";
import React from "react";
import './globals.css'
import { PlayerProvider } from '../app/context/playerContext';
import MiniPlayer from '../app/components/miniPlayer';
import { DownloadProvider } from "./context/downloadContext";
import DownloadProgressModal from "./components/downloadStatus"; // Import the modal

export default function RootLayout() {
  return (
    <PlayerProvider>
      <DownloadProvider>

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        
        <MiniPlayer />
        <DownloadProgressModal />
        
      </DownloadProvider>
    </PlayerProvider>
  )
}