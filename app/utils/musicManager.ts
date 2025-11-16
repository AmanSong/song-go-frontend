import { Directory, File, FileHandle, Paths } from 'expo-file-system';

export const MusicManager = {

  async deleteMusic(songId: string) {
    try {
      const songDir = new Directory(Paths.document, `music/${songId}`);
      if (songDir.exists) {
        songDir.delete();
        console.log(`✅ Deleted music folder: ${songId}`);
        return true;
      } else {
        console.warn(`⚠️ Folder not found: ${songId}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting music:', error);
      throw error;
    }
  },

  async renameMusic(songId: string, newName: string) {
    try {
      const musicDir = new Directory(Paths.document, 'music');
      if (!musicDir.exists) {
        console.error('Music folder does not exist');
        return null;
      }

      const songFolder = new Directory(musicDir.uri, songId);
      if (!songFolder.exists) {
        console.error(`Song folder ${songId} does not exist`);
        return null;
      }

      const folderContents = songFolder.list();
      const nameFile = folderContents.find(f => f.name === 'musicName.txt');

      if (nameFile && nameFile.exists) {
        const file = new File(nameFile.uri);
        file.open();
        file.write(newName);

        return true;
      } else {
        console.log('musicName.txt not found');
        return null;
      }
    } catch (error) {
      console.error('Error reading song name:', error);
      return null;
    }
  },
};

export default MusicManager;