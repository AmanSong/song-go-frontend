import { MusicFile } from "./musicManager";
import MusicManager from "./musicManager";

export const databaseUtility = {
    async backup(userId: string) {
        let musicList: MusicFile[] = [];
        
        try {
            const files = await MusicManager.listMusicFiles();
            musicList = files || []; 
        } catch (error) {
            console.error('Error getting music files:', error);
            musicList = [];
        }

        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000'}/api/database/backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, musicList }),
            });
            
            if (!response.ok) {
                throw new Error('Backup failed');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during backup:', error);
            throw error;
        }
    }
};