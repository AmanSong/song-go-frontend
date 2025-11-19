import { Stack } from "expo-router";
import React from "react";
import './globals.css'

import { PlayerProvider } from '../app/context/playerContext';
import MiniPlayer from '../app/components/miniPlayer';

export default function RootLayout() {

  return (
    <PlayerProvider>
      <MiniPlayer />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PlayerProvider>
  )
}
