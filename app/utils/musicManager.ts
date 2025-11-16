import { Directory, File, FileHandle, Paths } from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

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

  async createPlaylist(name: string) {
    const playlistsDir = new Directory(Paths.document, 'playlists');

    if (!playlistsDir.exists) {
      playlistsDir.create({ intermediates: true });
    }

    const id = uuidv4();

    const playlistFile = new File(playlistsDir, `${id}.json`);

    const data = {
      id,
      name,
      songIds: []
    };

    playlistFile.create();
    playlistFile.write(JSON.stringify(data));

    return id;
  },

  async loadPlaylists() {
    const playlistsDir = new Directory(Paths.document, 'playlists');

    const files = playlistsDir.list();
    const playlists = [];

    for (const f of files) {
      if (!f.name.endsWith('.json')) continue;

      const file = new File(playlistsDir, f.name);
      const text = await file.text();

      playlists.push(JSON.parse(text));
    }

    return playlists;
  },

  async addSongToPlaylist(playlistId: string, songId: string) {
    const playlistsDir = new Directory(Paths.document, 'playlists');
    const playlistFile = new File(playlistsDir, `${playlistId}.json`);

    const json = await playlistFile.text();
    const playlist = JSON.parse(json);

    if (!playlist.songIds.includes(songId)) {
        playlist.songIds.push(songId);
    }

    playlistFile.write(JSON.stringify(playlist));
}

};

export default MusicManager;