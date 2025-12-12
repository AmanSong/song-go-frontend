import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Directory, File, Paths } from 'expo-file-system';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useDownload } from '../context/downloadContext';
import MusicManager from "../utils/musicManager";

interface DownloadProps {
    id: string;
    title: string;
    image?: string;
}

interface SongMetadata {
    title: string;
    audioUri: string;
    coverUri?: string;
}

export default function Downloader({ id, title, image }: DownloadProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    // Use the download context
    const {
        startDownloadProgress,
        updateDownloadProgress,
        completeDownload,
        errorDownload,

    } = useDownload();

    async function download(): Promise<SongMetadata | void> {
        if (!id) {
            console.warn("No ID to download");
            return;
        }

        try {
            setIsDownloading(true);
            startDownloadProgress();

            // Get / create the main music folder
            const musicDir = new Directory(Paths.document, 'music');
            if (!musicDir.exists) {
                musicDir.create({ intermediates: true });
            }

            // Create a unique folder for this song
            const folderId = uuidv4();
            const songDir = new Directory(musicDir, folderId);
            songDir.create({ intermediates: true });

            // A text file to store the music name
            const musicName = new File(songDir, 'musicName.txt');
            musicName.create();
            musicName.write(title);

            // Download audio with progress tracking
            const musicFile = new File(songDir, 'audio.mp3');
            const musicUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/video/download/${id}`;
            console.log("DOWNLOADING: " + musicUrl);
            
            
            updateDownloadProgress(10);

            // Download audio file
            const downloadResult = await File.downloadFileAsync(musicUrl, musicFile);
            if (!downloadResult.exists) {
                throw new Error('Audio download failed');
            }

            updateDownloadProgress(60);

            // Optional cover image
            let coverUri: string | undefined = undefined;
            if (image) {
                const coverFile = new File(songDir, 'cover.jpg');
                try {
                    const coverResult = await File.downloadFileAsync(image, coverFile);
                    if (coverResult.exists) {
                        coverUri = coverFile.uri;
                        updateDownloadProgress(90);
                    } else {
                        console.warn('Cover download failed');
                    }
                } catch (err) {
                    console.warn('Cover download error:', err);
                    MusicManager.deleteMusic(folderId);
                }
            }


            updateDownloadProgress(100);
            completeDownload();
            setIsDownloading(false);

        } catch (err) {
            console.error('Download failed:', err);
            errorDownload();
            setIsDownloading(false);
        }
    }

    return (
        <TouchableOpacity onPress={() => download()}>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 8 }}>
                {
                    isDownloading ?
                        <ActivityIndicator size={50} color={"#3C3636"}></ActivityIndicator>
                        :
                        <MaterialIcons name="download-for-offline" size={50} color="#3C3636" />
                }
            </View>
        </TouchableOpacity>
    );
}