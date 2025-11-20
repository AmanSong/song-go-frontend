import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';

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

    // audio control API
    setAudioRef: (ref: any) => void;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    togglePlay: () => Promise<void>;
    stopAndClear: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
    const [isPlayingMini, setIsPlaying] = useState(false);
    const [showMiniPlayer, setShowMiniPlayer] = useState(false);
    const [musicList, setMusicList] = useState<MusicFile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // generic audio ref (works for expo-audio audio player object)
    const audioRef = useRef<any>(null);

    const setAudioRef = (ref: any) => {
        audioRef.current = ref;
    };

    const play = async () => {
        try {
            const player = audioRef.current;
            if (!player) return;
            // try common play signatures
            if (player.playAsync) await player.playAsync();
            else if (player.play) await player.play();
            else player.play?.();
            setIsPlaying(true);
        } catch (e) {
            console.error('play error', e);
        }
    };

    const pause = async () => {
        try {
            const player = audioRef.current;
            if (!player) return;
            if (player.pauseAsync) await player.pauseAsync();
            else if (player.pause) await player.pause();
            else player.pause?.();
            setIsPlaying(false);
        } catch (e) {
            console.error('pause error', e);
        }
    };

    const togglePlay = async () => {
        try {
            const player = audioRef.current;
            if (!player) return;


            let isCurrentlyPlaying: boolean | null = null;
            if (player.getStatusAsync) {
                const status = await player.getStatusAsync();
                isCurrentlyPlaying = !!status?.isPlaying;
            } else if (typeof player.playing === 'boolean') {
                isCurrentlyPlaying = !!player.playing;
            }

            if (isCurrentlyPlaying === null) {
                // fallback: toggle via play/pause methods
                if (isPlayingMini) await pause();
                else await play();
            } else {
                if (isCurrentlyPlaying) await pause();
                else await play();
            }
        } catch (e) {
            console.error('togglePlay error', e);
        }
    };

    const stopAndClear = async () => {
        try {
            const p = audioRef.current;
            if (p) {
                if (p.unloadAsync) await p.unloadAsync();
                else if (p.stop) await p.stop();
                else if (p.release) p.release();
            }
        } catch (e) {
            console.warn('stopAndClear unload error', e);
        } finally {
            audioRef.current = null;
            setCurrentTrack(null);
            setIsPlaying(false);
            setShowMiniPlayer(false);
            setMusicList([]);
            setCurrentIndex(0);
        }
    };

        return (
            <PlayerContext.Provider
                value={{
                    currentTrack,
                    isPlaying: isPlayingMini,
                    showMiniPlayer,
                    setCurrentTrack,
                    setIsPlaying,
                    setShowMiniPlayer,
                    musicList,
                    setMusicList,
                    currentIndex,
                    setCurrentIndex,
                    setAudioRef,
                    play,
                    pause,
                    togglePlay,
                    stopAndClear
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