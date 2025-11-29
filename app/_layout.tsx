import { Stack } from "expo-router";
import React from "react";
import './globals.css'
import { PlayerProvider } from './context/playerContext';
import MiniPlayer from '../app/components/miniPlayer';
import { DownloadProvider } from "./context/downloadContext";
import DownloadProgressModal from "./components/downloadStatus";
import { AuthProvider } from "./context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <DownloadProvider>

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>

          <MiniPlayer />
          <DownloadProgressModal />

        </DownloadProvider>
      </PlayerProvider>
    </AuthProvider>
  )
}