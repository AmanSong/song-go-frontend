// contexts/PlayerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MusicFile {
  id: string;
  name: string;
  music?: any;
  image?: any;
}

interface PlayerContextType {
  currentTrack: MusicFile | null;
  isPlaying: boolean;
  showMiniPlayer: boolean;
  setCurrentTrack: (track: MusicFile | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setShowMiniPlayer: (show: boolean) => void;
  musicList: MusicFile[];
  setMusicList: (list: MusicFile[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [musicList, setMusicList] = useState<MusicFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        showMiniPlayer,
        setCurrentTrack,
        setIsPlaying,
        setShowMiniPlayer,
        musicList,
        setMusicList,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};