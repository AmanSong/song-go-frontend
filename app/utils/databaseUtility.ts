import MusicManager from "./musicManager";

export const databaseUtility = {

    async backup(userId: string) {
        try {
            const musicFiles = await MusicManager.listMusicFiles();

            const formData = new FormData();
            formData.append("userId", userId);

            musicFiles?.forEach((file) => {
                formData.append("files", {
                    uri: file.music,
                    name: file.name || "music.mp3",
                    type: "audio/mpeg",
                    
                } as any);
            });

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/database/backup`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Backup failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {

            console.error('Error during backup:', error);
            throw error;
        }
    },

    async retrieve(userId: string) {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/database/retrieve?userId=${userId}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error('Retrieve failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during data retrieval", error);
        }
    }

};