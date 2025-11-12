import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Directory, File, Paths } from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

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
    const SERVER_IP = process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000';
    const [isDownloading, setIsDownloading] = useState(false);

    async function download(): Promise<SongMetadata | void> {
        if (!id) {
            console.warn("No ID to download");
            return;
        }

        try {
            setIsDownloading(true);

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

            // Download audio
            const musicFile = new File(songDir, 'audio.mp3');
            const musicUrl = `http://${SERVER_IP}/api/video/download/${id}`;
            console.log("DOWNLOADING" + musicUrl)
            const downloadResult = await File.downloadFileAsync(musicUrl, musicFile);
            if (!downloadResult.exists) {
                throw new Error('Audio download failed');
            }

            // Optional cover image
            let coverUri: string | undefined = undefined;
            if (image) {
                const coverFile = new File(songDir, 'cover.jpg');
                try {
                    const coverResult = await File.downloadFileAsync(image, coverFile);
                    if (coverResult.exists) {
                        coverUri = coverFile.uri;
                    } else {
                        console.warn('Cover download failed');
                        setIsDownloading(false);
                        alert('Cover download failed');
                    }
                } catch (err) {
                    console.warn('Cover download error:', err);
                }
            }

            setIsDownloading(false);
            alert(`Finished downloading ${title}`);

        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed');
            setIsDownloading(false);
        }
    }

    return (
        <TouchableOpacity onPress={() => download()}>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 8 }}>
                {
                    isDownloading ?
                    <ActivityIndicator size={36} color={"#3C3636"}></ActivityIndicator>
                    :
                    <MaterialIcons name="download-for-offline" size={36} color="#3C3636" />
                }
            </View>
        </TouchableOpacity>
    );
}
