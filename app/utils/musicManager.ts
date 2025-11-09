import { Directory, File, Paths } from 'expo-file-system';

export const MusicManager = {
  

  async deleteMusic(folderId: string) {
    try {
      const songDir = new Directory(Paths.document, `music/${folderId}`);
      if (songDir.exists) {
        songDir.delete();
        console.log(`✅ Deleted music folder: ${folderId}`);
        return true;
      } else {
        console.warn(`⚠️ Folder not found: ${folderId}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting music:', error);
      throw error;
    }
  },


};

export default MusicManager;